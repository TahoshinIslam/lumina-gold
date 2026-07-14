import { headers } from 'next/headers';

/**
 * A fixed-window rate limiter.
 *
 * READ THIS BEFORE YOU TRUST IT IN PRODUCTION
 * -------------------------------------------
 * The counters live in the memory of one Node process. That is genuinely
 * sufficient for this app as deployed today — a single `next start` behind
 * XAMPP — and it is a real defence: without it, `loginAction` will happily
 * check ten thousand passwords a second against a default password of
 * "lumina123".
 *
 * But it does NOT survive:
 *   - more than one instance (each has its own counters, so N instances = N x
 *     the limit), or
 *   - a restart (counters reset, and a deploy is a free reset for an attacker).
 *
 * The moment this runs on more than one instance, the store below has to move
 * to Redis or the database. The call sites do not change — only `hit()` does.
 * I am writing this down rather than quietly shipping something that looks
 * like a rate limiter and stops being one the day you scale out.
 */

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

/** Stop the map growing without bound on a long-lived process. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, w] of buckets) if (w.resetAt <= now) buckets.delete(key);
}

export type RateLimitResult = { ok: boolean; retryAfterSec: number };

/**
 * Count one attempt against `key`. Returns ok:false once `limit` attempts have
 * been made inside `windowSec`.
 */
export function hit(key: string, limit: number, windowSec: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { ok: true, retryAfterSec: 0 };
  }

  existing.count++;
  if (existing.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Forget every attempt for a key — call this on a SUCCESSFUL login, so a
 *  legitimate user who fumbled their password twice is not still near the
 *  limit afterwards. */
export function reset(key: string): void {
  buckets.delete(key);
}

/**
 * Who is calling.
 *
 * x-forwarded-for is set by whatever proxy sits in front of us and is trivially
 * spoofable if nothing does — so this is the FIRST hop, not the last, and it is
 * only ever used as a rate-limit bucket, never as an identity. The worst a
 * forged value can do is let an attacker spread their attempts across buckets;
 * it can never let them impersonate anyone.
 */
export async function clientKey(prefix: string): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  const ip = fwd ? fwd.split(',')[0]!.trim() : (h.get('x-real-ip') || 'unknown');
  return `${prefix}:${ip}`;
}

/** The limits, in one place, so they can be read at a glance and tested. */
export const LIMITS = {
  // Brute-forcing a password is the whole reason this file exists.
  login: { limit: 5, windowSec: 15 * 60 },
  // Registration: stops a script creating accounts in bulk.
  register: { limit: 5, windowSec: 60 * 60 },
  // Coupon codes are guessable ("SAVE10"), so an unlimited endpoint is a free
  // oracle for enumerating every valid discount on the site.
  coupon: { limit: 15, windowSec: 10 * 60 },
  // An order is expensive (it writes stock). This is generous for a human and
  // ruinous for a script.
  checkout: { limit: 10, windowSec: 10 * 60 },
  // Uploads cost disk and CPU (sharp re-encodes every image).
  upload: { limit: 30, windowSec: 10 * 60 },
} as const;
