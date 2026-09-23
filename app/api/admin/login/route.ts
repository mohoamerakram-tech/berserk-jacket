import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  assertSameOrigin,
  createAdminToken,
  verifyAdminCredentials,
} from '@/lib/admin/auth';

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimitKey(request: Request): string {
  const configuredHeader = process.env.ADMIN_CLIENT_IP_HEADER?.trim().toLowerCase();
  if (configuredHeader && /^[a-z0-9-]+$/.test(configuredHeader)) {
    return request.headers.get(configuredHeader)?.split(',')[0]?.trim() || 'unknown-client';
  }
  // Netlify overwrites this header at the edge. On other hosts, use one global
  // bucket unless a trusted proxy header is explicitly configured above.
  return request.headers.get('x-nf-client-connection-ip') || 'global';
}

export async function POST(request: Request) {
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  const key = rateLimitKey(request);
  const now = Date.now();
  const attempt = attempts.get(key);
  if (attempt && attempt.resetAt > now && attempt.count >= 5) {
    return Response.json({ error: 'Too many attempts. Wait 15 minutes and try again.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((attempt.resetAt - now) / 1000)) },
    });
  }
  const isFormSubmission = request.headers.get('content-type')?.includes('application/x-www-form-urlencoded') ?? false;
  let body: { email?: string; password?: string } | null = null;
  if (isFormSubmission) {
    const form = await request.formData().catch(() => null);
    body = form ? { email: String(form.get('email') || ''), password: String(form.get('password') || '') } : null;
  } else {
    body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  }
  if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
    return Response.json({ error: 'Enter your administrator email and password.' }, { status: 400 });
  }
  if (!verifyAdminCredentials(body.email, body.password)) {
    const current = attempt && attempt.resetAt > now ? attempt : { count: 0, resetAt: now + 15 * 60_000 };
    current.count += 1;
    attempts.set(key, current);
    return Response.json({ error: 'The email or password is incorrect.' }, { status: 401 });
  }
  attempts.delete(key);
  (await cookies()).set(ADMIN_COOKIE, createAdminToken(body.email), adminCookieOptions());
  if (isFormSubmission) return Response.redirect(new URL('/admin', request.url), 303);
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE() {
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  (await cookies()).delete(ADMIN_COOKIE);
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
