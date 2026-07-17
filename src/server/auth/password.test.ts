import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password hashing (scrypt)', () => {
  it('accepts the correct password', async () => {
    const stored = await hashPassword('correct horse battery staple');
    expect(await verifyPassword('correct horse battery staple', stored)).toBe(true);
  });

  it('rejects the wrong password', async () => {
    const stored = await hashPassword('s3cret-pass');
    expect(await verifyPassword('s3cret-Pass', stored)).toBe(false);
    expect(await verifyPassword('', stored)).toBe(false);
  });

  it('produces a different hash each time (random salt)', async () => {
    const a = await hashPassword('same-password');
    const b = await hashPassword('same-password');
    expect(a).not.toBe(b);
    // …yet both verify — the salt travels inside the stored string.
    expect(await verifyPassword('same-password', a)).toBe(true);
    expect(await verifyPassword('same-password', b)).toBe(true);
  });

  it('is self-describing: scrypt$N$r$p$keylen$salt$hash', async () => {
    const stored = await hashPassword('x');
    const parts = stored.split('$');
    expect(parts[0]).toBe('scrypt');
    expect(Number(parts[1])).toBeGreaterThan(1); // N
    expect(parts).toHaveLength(7);
  });

  it('never throws on a malformed or foreign hash — just returns false', async () => {
    expect(await verifyPassword('x', '')).toBe(false);
    expect(await verifyPassword('x', 'not-a-hash')).toBe(false);
    expect(await verifyPassword('x', '$2b$10$bcryptstyle')).toBe(false);
    expect(await verifyPassword('x', 'scrypt$0$0$0$0$aa$bb')).toBe(false);
  });

  it('still verifies a hash made with weaker parameters (params read from the string)', async () => {
    // A hash carrying its own N/r/p must keep verifying after the module's
    // defaults are raised — proven here by hand-checking a low-cost hash.
    const { scrypt } = await import('crypto');
    const salt = Buffer.from('0123456789abcdef');
    const low = await new Promise<Buffer>((res, rej) =>
      scrypt('legacy-pw', salt, 64, { N: 1024, r: 8, p: 1 }, (e, k) => (e ? rej(e) : res(k))),
    );
    const stored = `scrypt$1024$8$1$64$${salt.toString('base64')}$${low.toString('base64')}`;
    expect(await verifyPassword('legacy-pw', stored)).toBe(true);
    expect(await verifyPassword('wrong', stored)).toBe(false);
  });
});
