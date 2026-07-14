import { describe, it, expect } from 'vitest';
import { hit, reset, LIMITS } from './rateLimit';

describe('rate limiter — the brute-force gate', () => {
  it('allows exactly `limit` attempts, then blocks', () => {
    const key = `test:allow:${Math.random()}`;
    const results = Array.from({ length: 7 }, () => hit(key, 5, 900).ok);
    expect(results.slice(0, 5)).toEqual([true, true, true, true, true]);
    expect(results.slice(5)).toEqual([false, false]);
  });

  it('reports a positive retry-after once blocked', () => {
    const key = `test:retry:${Math.random()}`;
    for (let i = 0; i < 5; i++) hit(key, 5, 900);
    const blocked = hit(key, 5, 900);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it('reset() clears a bucket (a successful login should not leave the user near lockout)', () => {
    const key = `test:reset:${Math.random()}`;
    for (let i = 0; i < 6; i++) hit(key, 5, 900);
    expect(hit(key, 5, 900).ok).toBe(false);
    reset(key);
    expect(hit(key, 5, 900).ok).toBe(true);
  });

  it('keeps buckets independent (one IP hitting the wall does not block another)', () => {
    const a = `test:a:${Math.random()}`;
    const b = `test:b:${Math.random()}`;
    for (let i = 0; i < 6; i++) hit(a, 5, 900);
    expect(hit(a, 5, 900).ok).toBe(false);
    expect(hit(b, 5, 900).ok).toBe(true);
  });

  it('ships sane limits for the sensitive endpoints', () => {
    expect(LIMITS.login.limit).toBeLessThanOrEqual(10);
    expect(LIMITS.login.windowSec).toBeGreaterThanOrEqual(60);
    expect(LIMITS.coupon.limit).toBeGreaterThan(0);
    expect(LIMITS.checkout.limit).toBeGreaterThan(0);
  });
});
