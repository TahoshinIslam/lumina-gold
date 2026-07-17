import { createHmac, timingSafeEqual } from 'crypto';

/**
 * The admin session cookie.
 *
 * The old scheme stored sha256("lumina-admin:" + ADMIN_PASSWORD) and proved it
 * by recomputing the same thing from the env var — in proxy.ts, at the edge.
 * That only works while the password IS the env var. Once each admin is a row
 * in admin_users with its own hash, the edge has no way to recompute a
 * per-admin token without reading the database, which it cannot do.
 *
 * So the cookie becomes a signed claim instead of a derived secret:
 *
 *   <adminId>.<expiresUnix>.<hmacHex>
 *
 * The HMAC is over "<adminId>.<expiresUnix>" keyed with AUTH_SECRET — the same
 * key and construction signedUrl.ts already uses for certificate links. Anyone
 * can read the admin id and expiry; nobody without AUTH_SECRET can forge or
 * alter them. The edge verifies it with WebCrypto (see proxy.ts) and needs no
 * database; Node verifies it here. The two MUST compute the same MAC — there is
 * a parity test that signs here and re-verifies with WebCrypto to guarantee it.
 *
 * What this token deliberately does NOT do is carry the password hash, so a
 * password change does not invalidate live sessions. That is standard session
 * behaviour and the reason the TTL is a day, not a month; a "sign out
 * everywhere" needs server-side state and is a separate feature. Deactivating
 * an admin (is_active = 0) is likewise eventual — it takes effect when the page
 * layer next reads the row, and at the latest when the token expires.
 */

const SECRET = process.env.AUTH_SECRET || 'lumina-dev-secret-change-me';

/** One day. Long enough not to nag through a working session, short enough that
 *  a cookie lifted from a machine is useless by tomorrow. */
export const SESSION_TTL_SEC = 24 * 60 * 60;

/** The message the HMAC is computed over. Kept in one place because the edge
 *  verifier in proxy.ts has to build the exact same string. */
function payload(adminId: number, expires: number): string {
  return `${adminId}.${expires}`;
}

function mac(adminId: number, expires: number): string {
  return createHmac('sha256', SECRET).update(payload(adminId, expires)).digest('hex');
}

export function signSession(adminId: number, ttlSec: number = SESSION_TTL_SEC): string {
  const expires = Math.floor(Date.now() / 1000) + ttlSec;
  return `${adminId}.${expires}.${mac(adminId, expires)}`;
}

/**
 * The admin id if the token is well-formed, correctly signed, and unexpired;
 * otherwise null. Never throws — a garbage cookie is an anonymous request, not
 * an error.
 */
export function verifySession(token: string | undefined | null): number | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [idStr, expStr, sig] = parts;
  const adminId = Number(idStr);
  const expires = Number(expStr);
  if (!Number.isInteger(adminId) || adminId <= 0) return null;
  if (!Number.isInteger(expires)) return null;
  if (expires < Math.floor(Date.now() / 1000)) return null;

  const expected = mac(adminId, expires);
  // Hex of the same length, so timingSafeEqual will not throw; the length check
  // is implicit in both being sha256 hex, but compare defensively anyway.
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  return adminId;
}
