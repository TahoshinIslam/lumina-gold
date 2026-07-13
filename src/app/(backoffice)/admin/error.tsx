'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/** Admin error boundary — technical, because the reader is the one who can fix it. */
export default function AdminError({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error('[admin]', error); }, [error]);

  return (
    <div className="adm-card" style={{ maxWidth: 560 }}>
      <h1 className="adm-h1">Something went wrong</h1>
      <p className="adm-sub">
        This page failed to render. The change you were making may not have been saved — check the
        record before trying again.
      </p>
      {error.digest && <p className="adm-sub"><strong>Digest:</strong> {error.digest}</p>}
      <p className="adm-sub"><strong>Message:</strong> {error.message}</p>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button className="adm-btn" onClick={reset}>Try again</button>
        <Link className="adm-btn ghost" href="/admin">Dashboard</Link>
      </div>
    </div>
  );
}
