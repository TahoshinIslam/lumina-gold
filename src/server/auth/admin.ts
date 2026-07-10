import { createHash } from 'crypto';

/**
 * Minimal local admin auth (single shared password, XAMPP-style setup).
 * Password comes from ADMIN_PASSWORD env (default "lumina123" for local dev).
 * The session cookie stores a salted hash so the raw password never leaves
 * the server. Swap for real per-user auth (admin_users table) before launch.
 */
export const ADMIN_COOKIE = 'lum_admin';

export function adminToken(): string {
  const password = process.env.ADMIN_PASSWORD || 'lumina123';
  return createHash('sha256').update(`lumina-admin:${password}`).digest('hex');
}

export function checkPassword(input: string): boolean {
  return input === (process.env.ADMIN_PASSWORD || 'lumina123');
}
