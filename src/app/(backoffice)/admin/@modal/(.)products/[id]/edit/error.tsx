'use client';

import Link from 'next/link';

/** A failed load inside the drawer must not blank the products list behind it —
 *  this boundary keeps the failure inside the @modal slot. */
export default function EditProductDrawerError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="adm-drawer adm-drawer--loading">
      <div className="adm-drawer-head">
        <h2 className="adm-drawer-title">Couldn’t open this product</h2>
        <p className="adm-drawer-desc">The product editor failed to load. It may have been deleted.</p>
      </div>
      <div className="adm-drawer-body">
        <div className="adm-error-actions">
          <button type="button" className="adm-btn" onClick={reset}>Try again</button>
          <Link className="adm-btn ghost" href="/admin/products">Back to products</Link>
        </div>
      </div>
    </div>
  );
}
