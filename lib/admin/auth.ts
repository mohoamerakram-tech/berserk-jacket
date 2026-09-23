import 'server-only';

import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_COOKIE = 'future-stitch-admin';
const SESSION_SECONDS = 8 * 60 * 60;

interface AdminSession {
  email: string;
  expiresAt: number;
}

function config() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || '';
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  return { email, passwordHash, secret, ready: Boolean(email && passwordHash && secret.length >= 32) };
}

function sign(encodedPayload: string, secret: string) {
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

export function createAdminToken(email: string): string {
  const { secret, ready } = config();
  if (!ready) throw new Error('Admin authentication is not configured.');
  const payload: AdminSession = { email: email.toLowerCase(), expiresAt: Date.now() + SESSION_SECONDS * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifyAdminToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const { email, secret, ready } = config();
  if (!ready) return null;
  const [encoded, receivedSignature] = token.split('.');
  if (!encoded || !receivedSignature) return null;
  const expectedSignature = sign(encoded, secret);
  const left = Buffer.from(receivedSignature);
  const right = Buffer.from(expectedSignature);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const session = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as AdminSession;
    if (session.email !== email || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const expected = config();
  if (!expected.ready || email.trim().toLowerCase() !== expected.email) return false;
  const [algorithm, salt, stored] = expected.passwordHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !stored) return false;
  const calculated = scryptSync(password, salt, 64);
  const storedBytes = Buffer.from(stored, 'hex');
  return calculated.length === storedBytes.length && timingSafeEqual(calculated, storedBytes);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  return verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function requireAdminApi(): Promise<AdminSession | null> {
  return getAdminSession();
}

export async function assertSameOrigin(): Promise<boolean> {
  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');
  const host = requestHeaders.get('host');
  if (!origin || !host) return process.env.NODE_ENV !== 'production';
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: SESSION_SECONDS,
  };
}

export function getConfiguredAdminEmail(): string {
  return config().email;
}
