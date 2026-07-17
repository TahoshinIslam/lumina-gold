import { describe, it, expect } from 'vitest';
import { signSession, verifySession, SESSION_TTL_SEC } from './adminSession';

describe('admin session token (Node side)', () => {
  it('round-trips: a freshly signed token verifies to its admin id', () => {
    expect(verifySession(signSession(42))).toBe(42);
  });

  it('rejects tampering with the admin id', () => {
    const token = signSession(7);
    const forged = token.replace(/^7\./, '8.');
    expect(verifySession(forged)).toBeNull();
  });

  it('rejects an expired token', () => {
    // Sign with a negative TTL so it is already in the past.
    expect(verifySession(signSession(1, -10))).toBeNull();
  });

  it('rejects malformed tokens without throwing', () => {
    expect(verifySession(undefined)).toBeNull();
    expect(verifySession('')).toBeNull();
    expect(verifySession('1.2')).toBeNull();
    expect(verifySession('1.2.3.4')).toBeNull();
    expect(verifySession('x.y.z')).toBeNull();
    expect(verifySession('0.9999999999.deadbeef')).toBeNull(); // id <= 0
  });

  it('rejects a good payload with a wrong signature', () => {
    const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC;
    expect(verifySession(`5.${exp}.${'0'.repeat(64)}`)).toBeNull();
  });
});

/**
 * The whole design rests on proxy.ts (edge, WebCrypto) accepting exactly what
 * this module (Node, node:crypto) signs. This reimplements the edge verifier
 * with crypto.subtle and asserts it agrees — if the two ever diverge, every
 * admin is either locked out or let through, and this test is what catches it.
 */
async function edgeVerify(token: string, secret: string): Promise<number | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [idStr, expStr, sig] = parts;
  const adminId = Number(idStr);
  const expires = Number(expStr);
  if (!Number.isInteger(adminId) || adminId <= 0) return null;
  if (expires < Math.floor(Date.now() / 1000)) return null;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${adminId}.${expires}`));
  const expected = Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0 ? adminId : null;
}

describe('Node ⇄ edge parity', () => {
  // adminSession reads AUTH_SECRET at import; mirror that default here.
  const SECRET = process.env.AUTH_SECRET || 'lumina-dev-secret-change-me';

  it('the WebCrypto edge verifier accepts a Node-signed token', async () => {
    const token = signSession(123);
    expect(await edgeVerify(token, SECRET)).toBe(123);
  });

  it('the edge verifier rejects a token Node also rejects (bad sig)', async () => {
    const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC;
    const bad = `123.${exp}.${'a'.repeat(64)}`;
    expect(await edgeVerify(bad, SECRET)).toBeNull();
    expect(verifySession(bad)).toBeNull();
  });

  it('the edge verifier rejects an expired Node-signed token', async () => {
    expect(await edgeVerify(signSession(9, -5), SECRET)).toBeNull();
  });
});
