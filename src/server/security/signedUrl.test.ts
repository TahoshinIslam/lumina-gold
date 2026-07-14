import { describe, it, expect } from 'vitest';
import { signPath, verify, DEFAULT_TTL_SEC } from './signedUrl';

/** Pull file/exp/sig back out of a signed URL for the verify() calls. */
function parts(url: string) {
  const q = new URLSearchParams(url.split('?')[1]);
  return { file: q.get('file'), exp: q.get('exp'), sig: q.get('sig') };
}

describe('signed URLs — the only door to a private document', () => {
  it('a freshly signed URL verifies', () => {
    const { file, exp, sig } = parts(signPath('products/ABC/certificate.pdf'));
    const v = verify(file, exp, sig);
    expect(v.ok).toBe(true);
    if (v.ok) expect(v.file).toBe('products/ABC/certificate.pdf');
  });

  it('rejects a tampered signature', () => {
    const { file, exp, sig } = parts(signPath('products/ABC/certificate.pdf'));
    const flipped = sig!.slice(0, -1) + (sig!.endsWith('0') ? '1' : '0');
    expect(verify(file, exp, flipped)).toMatchObject({ ok: false, reason: 'bad-signature' });
  });

  it('rejects a tampered path even with a real (other) signature', () => {
    const { exp, sig } = parts(signPath('products/ABC/certificate.pdf'));
    // Same exp+sig, different file — must not validate for a file we didn't sign.
    expect(verify('products/OTHER/certificate.pdf', exp, sig)).toMatchObject({ ok: false });
  });

  it('rejects an expired URL', () => {
    const { file, sig } = parts(signPath('products/ABC/certificate.pdf'));
    // A past expiry with any signature — expiry is checked before the HMAC.
    expect(verify(file, '1', sig)).toMatchObject({ ok: false });
  });

  it('rejects missing parameters', () => {
    expect(verify(null, null, null)).toMatchObject({ ok: false, reason: 'missing' });
  });

  it('the default TTL is short-lived (minutes, not days)', () => {
    expect(DEFAULT_TTL_SEC).toBeLessThanOrEqual(60 * 60);
  });
});
