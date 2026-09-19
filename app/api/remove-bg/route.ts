import { isIP } from 'node:net';

export const runtime = 'nodejs';
export const maxDuration = 35;
const MAX_FILE = 10 * 1024 * 1024;
const MAX_BODY = MAX_FILE + 64 * 1024;
const buckets = new Map<string, { count: number; until: number }>();

function error(code: string, message: string, status: number, headers = {}) {
  return Response.json({ code, message }, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

export async function POST(request: Request) {
  // Only trust a header overwritten by your reverse proxy. Never trust arbitrary X-Forwarded-For.
  const ipHeader = process.env.REMBG_CLIENT_IP_HEADER;
  const candidate = ipHeader ? request.headers.get(ipHeader)?.trim() : undefined;
  const key = candidate && isIP(candidate) ? candidate : 'shared';
  const now = Date.now();
  for (const [ip, bucket] of buckets) if (bucket.until <= now) buckets.delete(ip);
  const bucket = buckets.get(key) ?? { count: 0, until: now + 60_000 };
  if (bucket.count >= 10 || (!buckets.has(key) && buckets.size >= 10000)) {
    return error('RATE_LIMITED', 'Too many uploads. Please wait a minute and try again.', 429,
      { 'Retry-After': String(Math.max(1, Math.ceil((bucket.until - now) / 1000))) });
  }
  bucket.count++;
  buckets.set(key, bucket);

  if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) {
    return error('INVALID_UPLOAD', 'Please upload a PNG or JPG image.', 400);
  }
  if (Number(request.headers.get('content-length')) > MAX_BODY) {
    return error('FILE_TOO_LARGE', 'Please choose an image smaller than 10 MB.', 413);
  }
  // Bound bytes while reading too: Content-Length can be missing or dishonest.
  const reader = request.body?.getReader();
  if (!reader) return error('INVALID_UPLOAD', 'Please choose an image.', 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  let form: FormData;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY) {
        await reader.cancel();
        return error('FILE_TOO_LARGE', 'Please choose an image smaller than 10 MB.', 413);
      }
      chunks.push(value);
    }
    form = await new Response(Buffer.concat(chunks), {
      headers: { 'Content-Type': request.headers.get('content-type')! },
    }).formData();
  } catch {
    return error('INVALID_UPLOAD', 'This upload could not be read. Please try again.', 400);
  }
  const file = form.get('file');
  if (!(file instanceof File) || !file.size || form.getAll('file').length !== 1) {
    return error('INVALID_UPLOAD', 'Please choose one PNG or JPG image.', 400);
  }
  if (/\.(svg|ai|eps|pdf)$/i.test(file.name) || /svg|postscript|pdf/.test(file.type)) {
    return error('VECTOR_NOT_SUPPORTED', 'Vector files not supported, please upload PNG/JPG.', 415);
  }
  if (file.size > MAX_FILE) return error('FILE_TOO_LARGE', 'Please choose an image smaller than 10 MB.', 413);
  const signature = Buffer.from(await file.slice(0, 8).arrayBuffer());
  const png = signature.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const jpg = signature[0] === 255 && signature[1] === 216 && signature[2] === 255;
  if (!((file.type === 'image/png' && png) || (file.type === 'image/jpeg' && jpg))) {
    return error('UNSUPPORTED_FORMAT', 'Please upload a valid PNG or JPG image.', 415);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  const abort = () => controller.abort();
  request.signal.addEventListener('abort', abort, { once: true });
  const cleanup = () => { clearTimeout(timer); request.signal.removeEventListener('abort', abort); };
  try {
    const body = new FormData();
    body.append('image', file, png ? 'artwork.png' : 'artwork.jpg');
    const response = await fetch('https://api.nobg.akshit.io/api/v1/remove-background', {
      method: 'POST', body, signal: controller.signal, cache: 'no-store', redirect: 'error',
    });
    if (response.status === 429) {
      console.error('[remove-bg] nobg rate limit reached');
      const retryAfter = response.headers.get('retry-after');
      await response.body?.cancel();
      cleanup();
      return error('UPSTREAM_RATE_LIMITED',
        'Background removal has reached its daily service limit. Please try again later.', 429,
        retryAfter ? { 'Retry-After': retryAfter } : {});
    }
    if (!response.ok || !response.body || !response.headers.get('content-type')?.startsWith('image/png')) {
      console.error('[remove-bg] Invalid upstream response:', response.status);
      await response.body?.cancel();
      cleanup();
      return error('PROCESSING_FAILED', 'We could not process this image. Try another PNG or JPG.', 502);
    }
    const upstream = response.body.getReader();
    const stream = new ReadableStream({
      async pull(output) {
        try {
          const { done, value } = await upstream.read();
          if (done) { cleanup(); output.close(); } else output.enqueue(value);
        } catch {
          console.error('[remove-bg] Response interrupted or timed out');
          cleanup(); output.error(new Error('Background removal interrupted'));
        }
      },
      async cancel() { controller.abort(); cleanup(); await upstream.cancel(); },
    });
    return new Response(stream, { headers: {
      'Content-Type': 'image/png', 'Cache-Control': 'no-store',
      'Content-Disposition': 'inline; filename="artwork.png"', 'X-Content-Type-Options': 'nosniff',
    } });
  } catch (failure) {
    cleanup();
    const timeout = controller.signal.aborted;
    console.error('[remove-bg]', timeout ? 'Processing timeout/client disconnect' : 'Upstream unavailable',
      failure instanceof Error ? failure.message : 'Unknown failure');
    return error(timeout ? 'PROCESSING_TIMEOUT' : 'SERVICE_UNAVAILABLE', timeout
      ? 'Processing took longer than 30 seconds. Please try a smaller image.'
      : 'Background removal is temporarily offline. Please try again shortly.', timeout ? 504 : 503);
  }
}
