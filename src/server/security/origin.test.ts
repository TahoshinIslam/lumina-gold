import { describe, it, expect } from 'vitest';
import { isSameOrigin } from './origin';
import type { NextRequest } from 'next/server';

/** Minimal stand-in: isSameOrigin only reads request.headers.get(). */
function req(headers: Record<string, string>): NextRequest {
  return { headers: { get: (k: string) => headers[k.toLowerCase()] ?? null } } as unknown as NextRequest;
}

describe('isSameOrigin — CSRF gate for route handlers', () => {
  it('accepts a same-origin request', () => {
    expect(isSameOrigin(req({ origin: 'https://shop.example', host: 'shop.example' }))).toBe(true);
  });

  it('prefers the forwarded host (behind a proxy)', () => {
    expect(isSameOrigin(req({
      origin: 'https://shop.example', host: 'internal:3000', 'x-forwarded-host': 'shop.example',
    }))).toBe(true);
  });

  it('rejects a cross-origin request', () => {
    expect(isSameOrigin(req({ origin: 'https://evil.example', host: 'shop.example' }))).toBe(false);
  });

  it('rejects a request with no Origin header (not a browser form post)', () => {
    expect(isSameOrigin(req({ host: 'shop.example' }))).toBe(false);
  });

  it('rejects a malformed Origin rather than throwing', () => {
    expect(isSameOrigin(req({ origin: 'not a url', host: 'shop.example' }))).toBe(false);
  });
});
