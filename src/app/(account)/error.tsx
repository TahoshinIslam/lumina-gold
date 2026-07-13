'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * The last line of defence for the storefront.
 *
 * runAction stops an *action* from taking the UI down; this catches everything
 * else — a render that throws, a DAL call that fails mid-page. Without it, Next
 * shows a blank screen and the shopper has no way back.
 */
export default function AccountError({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is what ties this screen to the line in the server log.
    console.error('[account]', error);
  }, [error]);

  return (
    <div className="lum-root">
      <main className="lum-page-main">
        <div className="lum-cart" style={{ textAlign: 'center' }}>
          <h1 className="lum-h2 lum-listing-title">Something went wrong</h1>
          <p className="lum-pdp-desc" style={{ maxWidth: 480, margin: '10px auto 0' }}>
            We couldn’t load your account just now. Your orders and details are untouched.
          </p>
          {error.digest && <p className="lum-pdp-note">Reference: {error.digest}</p>}
          <div style={{ marginTop: 26, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="lum-cta-gold" onClick={reset}>Try again</button>
            <Link href="/account" className="lum-cta-ghost">Back to your account</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
