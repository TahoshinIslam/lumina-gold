import { scrypt as scryptCb, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

/**
 * Password hashing for admin accounts.
 *
 * scrypt from node:crypto — deliberately NOT bcrypt/argon2. Those are native
 * addons that have to compile per platform, and this app targets a serverless
 * host where a build that works on your Mac and fails on the deploy image is a
 * whole class of problem avoided by using what ships with Node. scrypt is a
 * memory-hard KDF designed for exactly this; the cost is that it runs in Node,
 * not the edge — which is fine, because hashing only ever happens at login and
 * password-change, both of which run in a Server Action (Node), never in proxy.
 *
 * Stored form is self-describing so the parameters can move later without
 * orphaning existing hashes:
 *
 *   scrypt$N$r$p$keylen$salt_b64$hash_b64
 *
 * verify() reads N/r/p back OUT of the stored string, so raising the cost for
 * new passwords does not invalidate old ones — they still verify against the
 * parameters they were made with, and re-hash on next change.
 */

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

// OWASP's floor for scrypt at the time of writing (N=2^14, r=8, p=1). N is the
// CPU/memory cost. Bump N first if this ever needs to be harder.
const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;
const SALT_BYTES = 16;

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const hash = await scrypt(plain, salt, KEYLEN, { N, r: R, p: P });
  return [
    'scrypt',
    N,
    R,
    P,
    KEYLEN,
    salt.toString('base64'),
    hash.toString('base64'),
  ].join('$');
}

/**
 * True iff `plain` produced `stored`. Never throws on a malformed or foreign
 * hash — it returns false, so a corrupted row is a failed login, not a 500 that
 * leaks a stack trace on the login page.
 *
 * The comparison is timing-safe: a byte-by-byte early return would let an
 * attacker recover the hash one position at a time from response timing.
 */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  try {
    const [scheme, nStr, rStr, pStr, keylenStr, saltB64, hashB64] = stored.split('$');
    if (scheme !== 'scrypt') return false;

    const n = Number(nStr);
    const r = Number(rStr);
    const p = Number(pStr);
    const keylen = Number(keylenStr);
    if (!n || !r || !p || !keylen) return false;

    const salt = Buffer.from(saltB64, 'base64');
    const expected = Buffer.from(hashB64, 'base64');
    if (expected.length !== keylen) return false;

    const actual = await scrypt(plain, salt, keylen, { N: n, r, p });
    // Both are `keylen` bytes here, so timingSafeEqual will not throw on a
    // length mismatch — but the guard above is what guarantees that.
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
