import Link from 'next/link';
import { Compass } from 'lucide-react';

/**
 * Admin 404.
 *
 * Rendered when a back-office route resolves to nothing — most often a
 * notFound() from an edit page whose record was deleted (a product, an order).
 * It sits inside the admin layout, so when it fires for a signed-in admin the
 * sidebar chrome stays and this is just the content column. The `.adm-404`
 * wrapper carries the admin token scope so var() resolves even if this ever
 * renders on its own.
 */
export const metadata = { title: 'Not found — Admin' };

export default function AdminNotFound() {
  return (
    <div className="adm-404">
      <div className="adm-404-card">
        <span className="adm-404-icon"><Compass size={26} /></span>
        <div className="adm-404-code">404</div>
        <h1 className="adm-404-title">We couldn’t find that page</h1>
        <p className="adm-404-text">
          The record may have been deleted, or the link is out of date. Head back
          to the dashboard and pick up from there.
        </p>
        <div className="adm-404-actions">
          <Link href="/admin" className="adm-btn">Back to dashboard</Link>
          <Link href="/admin/products" className="adm-btn ghost">Go to products</Link>
        </div>
      </div>
    </div>
  );
}
