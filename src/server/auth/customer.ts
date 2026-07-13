import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { query } from '@/server/db/client';

/**
 * Storefront customer auth — phone + password.
 *
 * Passwords are hashed with Node's built-in scrypt (no external dependency),
 * stored as `salt:hash`. The session is a cookie holding `userId.hmac`, signed
 * with AUTH_SECRET so it can't be forged; we never store server-side sessions.
 * This mirrors the admin auth pattern but is per-user rather than a single
 * shared password.
 */
export const CUSTOMER_COOKIE = 'lum_customer';
const SECRET = process.env.AUTH_SECRET || 'lumina-dev-secret-change-me';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const orig = Buffer.from(hash, 'hex');
  return orig.length === test.length && timingSafeEqual(orig, test);
}

function sign(userId: number): string {
  const sig = createHmac('sha256', SECRET).update(String(userId)).digest('hex');
  return `${userId}.${sig}`;
}

function verifyToken(token: string): number | null {
  const [idStr, sig] = token.split('.');
  const id = Number(idStr);
  if (!id || !sig) return null;
  const expected = createHmac('sha256', SECRET).update(idStr).digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return id;
}

export async function setCustomerSession(userId: number): Promise<void> {
  const jar = await cookies();
  jar.set(CUSTOMER_COOKIE, sign(userId), {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCustomerSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(CUSTOMER_COOKIE);
}

export type Customer = { id: number; name: string; phone: string | null; email: string | null };

export async function getCurrentCustomer(): Promise<Customer | null> {
  const jar = await cookies();
  const token = jar.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const id = verifyToken(token);
  if (!id) return null;
  const rows = await query<Customer>(
    'SELECT id, name, phone, email FROM users WHERE id = ? AND is_active = 1', [id],
  );
  return rows[0] ?? null;
}
