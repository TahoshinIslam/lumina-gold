import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Signed, expiring URLs for private files.
 *
 * A Certificate of Authenticity used to live in public/uploads, which meant it
 * was served by the static file handler to anyone who asked. The filename was a
 * convention — /uploads/products/<SKU>/certificate.pdf — so "anyone who asked"
 * included anyone who could guess a SKU, and SKUs are printed on the product
 * page. The whole certificate archive was enumerable by a for-loop.
 *
 * Now the bytes live outside public/ (see @/server/documents) and the only way
 * to them is a URL this module signed: it names one exact file, it expires, and
 * it cannot be edited — change so much as a character of the path or the expiry
 * and the HMAC no longer matches.
 */

const SECRET = process.env.AUTH_SECRET || 'lumina-dev-secret-change-me';

/** 10 minutes: long enough to click a link and read a PDF, short enough that a
 *  URL copied out of a browser history is worthless tomorrow. */
export const DEFAULT_TTL_SEC = 10 * 60;

function mac(path: string, expires: number): string {
  return createHmac('sha256', SECRET).update(`${path}:${expires}`).digest('hex');
}

/** A relative URL (path + query) that will serve `relPath` until it expires. */
export function signPath(relPath: string, ttlSec: number = DEFAULT_TTL_SEC): string {
  const expires = Math.floor(Date.now() / 1000) + ttlSec;
  const sig = mac(relPath, expires);
  const q = new URLSearchParams({ file: relPath, exp: String(expires), sig });
  return `/api/documents?${q.toString()}`;
}

export type Verdict = { ok: true; file: string } | { ok: false; reason: 'missing' | 'expired' | 'bad-signature' };

export function verify(file: string | null, exp: string | null, sig: string | null): Verdict {
  if (!file || !exp || !sig) return { ok: false, reason: 'missing' };

  const expires = Number(exp);
  if (!Number.isFinite(expires)) return { ok: false, reason: 'bad-signature' };
  if (expires * 1000 < Date.now()) return { ok: false, reason: 'expired' };

  // Constant-time: a byte-at-a-time comparison leaks the signature to anyone
  // patient enough to measure the response.
  const expected = Buffer.from(mac(file, expires));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: 'bad-signature' };
  }

  return { ok: true, file };
}
