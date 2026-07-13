'use client';

import Link from 'next/link';

export default function EditProductError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="adm-error-state">
      <h2>Couldn’t open this product</h2>
      <p>The product editor failed to load. It may have been deleted, or the database is unreachable.</p>
      <div className="adm-error-actions">
        <button type="button" className="adm-btn" onClick={reset}>Try again</button>
        <Link className="adm-btn ghost" href="/admin/products">Back to products</Link>
      </div>
    </div>
  );
}
