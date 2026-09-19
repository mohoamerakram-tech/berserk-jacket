import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../app/api/remove-bg/route.ts';

const originalFetch = globalThis.fetch;
let ip = 0;
process.env.REMBG_CLIENT_IP_HEADER = 'x-test-ip';
afterEach(() => { globalThis.fetch = originalFetch; });
const png = new Uint8Array([137,80,78,71,13,10,26,10,0]);
function request(bytes = png, type = 'image/png', name = 'art.png', address = `192.0.2.${++ip}`) {
  const form = new FormData();
  form.append('file', new File([bytes], name, { type }));
  return new Request('http://localhost/api/remove-bg', { method: 'POST', body: form, headers: { 'x-test-ip': address } });
}

test('streams PNG and forwards multipart file as image to nobg without API keys', async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.nobg.akshit.io/api/v1/remove-background');
    assert.equal(options.body.get('image').type, 'image/png');
    assert.equal(options.redirect, 'error');
    assert.equal(options.body.has('file'), false);
    assert.equal(options.headers, undefined);
    return new Response(png, { headers: { 'Content-Type': 'image/png' } });
  };
  const result = await POST(request());
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  assert.deepEqual(new Uint8Array(await result.arrayBuffer()), png);
});

test('rejects vector, false MIME, empty and oversized files without contacting nobg', async () => {
  globalThis.fetch = () => { throw new Error('Must not forward invalid input'); };
  for (const [input, code, status] of [
    [request('svg', 'image/svg+xml', 'art.svg'), 'VECTOR_NOT_SUPPORTED', 415],
    [request('AI', 'application/octet-stream', 'art.ai'), 'VECTOR_NOT_SUPPORTED', 415],
    [request('not a png'), 'UNSUPPORTED_FORMAT', 415],
    [request(''), 'INVALID_UPLOAD', 400],
    [request(new Uint8Array(10 * 1024 * 1024 + 1)), 'FILE_TOO_LARGE', 413],
  ]) {
    const result = await POST(input);
    assert.equal(result.status, status);
    assert.equal((await result.json()).code, code);
  }
});

test('bounds chunked multipart body even without Content-Length', async () => {
  const body = new ReadableStream({ start(controller) {
    controller.enqueue(new Uint8Array(11 * 1024 * 1024)); controller.close();
  } });
  const result = await POST(new Request('http://localhost/api/remove-bg', {
    method: 'POST', body, duplex: 'half', headers: {
      'content-type': 'multipart/form-data; boundary=test', 'x-test-ip': `192.0.2.${++ip}`,
    },
  }));
  assert.equal(result.status, 413);
});

test('offline and upstream errors return friendly JSON', async () => {
  globalThis.fetch = async () => { throw new Error('ECONNREFUSED'); };
  let result = await POST(request());
  assert.equal(result.status, 503);
  assert.equal((await result.json()).code, 'SERVICE_UNAVAILABLE');
  globalThis.fetch = async () => new Response('failure', { status: 500 });
  result = await POST(request());
  assert.equal(result.status, 502);
});

test('30 second upstream timeout returns 504', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let started;
  const ready = new Promise((resolve) => { started = resolve; });
  globalThis.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('aborted')));
    started();
  });
  const pending = POST(request());
  await ready;
  context.mock.timers.tick(30_000);
  const result = await pending;
  assert.equal(result.status, 504);
  assert.equal((await result.json()).code, 'PROCESSING_TIMEOUT');
});

test('rate limit is ten requests per minute per trusted IP', async () => {
  const address = `192.0.2.${++ip}`;
  for (let i = 0; i < 10; i++) assert.equal((await POST(request('', 'image/png', 'art.png', address))).status, 400);
  const result = await POST(request('', 'image/png', 'art.png', address));
  assert.equal(result.status, 429);
  assert.ok(Number(result.headers.get('retry-after')) > 0);
  assert.equal((await POST(request(''))).status, 400);
});

test('accepts JPEG and returns the processed PNG', async () => {
  globalThis.fetch = async (_url, { body }) => {
    assert.equal(body.get('image').type, 'image/jpeg');
    return new Response(png, { headers: { 'content-type': 'image/png' } });
  };
  const result = await POST(request(new Uint8Array([255,216,255,224,0,0,0,0]), 'image/jpeg', 'art.jpg'));
  assert.equal(result.status, 200);
  await result.arrayBuffer();
});

test('fails response stream if upstream stalls after headers', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  globalThis.fetch = async (_url, { signal }) => new Response(new ReadableStream({
    start(controller) { signal.addEventListener('abort', () => controller.error(new Error('timeout'))); },
  }), { headers: { 'content-type': 'image/png' } });
  const response = await POST(request());
  const reading = response.arrayBuffer();
  context.mock.timers.tick(30_000);
  await assert.rejects(reading, /interrupted/);
});


test('nobg quota exhaustion returns specific friendly 429 and Retry-After', async () => {
  globalThis.fetch = async () => new Response('quota exceeded', {
    status: 429, headers: { 'Retry-After': '3600' },
  });
  const result = await POST(request());
  assert.equal(result.status, 429);
  assert.equal(result.headers.get('retry-after'), '3600');
  const payload = await result.json();
  assert.equal(payload.code, 'UPSTREAM_RATE_LIMITED');
  assert.match(payload.message, /daily service limit/);
});

test('nobg 429 without Retry-After still returns friendly error', async () => {
  globalThis.fetch = async () => new Response(null, { status: 429 });
  const result = await POST(request());
  assert.equal(result.status, 429);
  assert.equal(result.headers.get('retry-after'), null);
  assert.equal((await result.json()).code, 'UPSTREAM_RATE_LIMITED');
});
