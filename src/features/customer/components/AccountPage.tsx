'use client';

import Link from 'next/link';
import { useStore } from '@/stores/StoreContext';
import { getProductBySku } from '@/features/catalog/catalog';
import { Product } from '@/types/product';
import ProductCard from '@/features/catalog/components/ProductCard';

type Customer = { id: number; name: string; phone: string | null; email: string | null };

/**
 * AccountPage — the shopper's account hub. Shows a signed-in header (name,
 * contact, sign-out) when a session exists, or a sign-in / register prompt for
 * guests. Saved items, bag, and recently viewed come from the client store and
 * show either way (they're device-local until accounts sync them).
 */
export default function AccountPage({
  customer, logoutAction,
}: {
  customer: Customer | null;
  logoutAction: () => void;
}) {
  const { wished, wishCount, cartCount, recent, toggleWish } = useStore();
  const recentItems = recent
    .map(getProductBySku)
    .filter((p): p is Product => !!p)
    .slice(0, 4);

  return (
    <div className="lum-cart">
      <h1 className="lum-h2 lum-listing-title">
        {customer ? `Welcome, ${customer.name.split(' ')[0]}` : 'My Account'}
      </h1>

      {customer ? (
        <div className="lum-account-meta">
          Signed in as <strong>{customer.phone}</strong>
          {customer.email ? <> · <strong>{customer.email}</strong></> : null}
          {' · '}
          <form action={logoutAction} style={{ display: 'inline' }}>
            <button type="submit" className="lum-link-gold"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}>
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <p className="lum-pdp-desc" style={{ maxWidth: 520 }}>
          <Link href="/account/login" className="lum-link-gold">Sign in</Link> or{' '}
          <Link href="/account/register" className="lum-link-gold">create an account</Link> to save your
          pieces and check out faster. Your saved items are kept on this device in the meantime.
        </p>
      )}

      <div className="lum-account-cards">
        <Link href="/wishlist" className="lum-account-card">
          <span className="lum-account-num">{wishCount}</span>
          <span className="lum-account-lbl">Saved pieces</span>
        </Link>
        <Link href="/cart" className="lum-account-card">
          <span className="lum-account-num">{cartCount}</span>
          <span className="lum-account-lbl">In your bag</span>
        </Link>
        <a href="#appointment" className="lum-account-card">
          <span className="lum-account-num">✦</span>
          <span className="lum-account-lbl">Book an appointment</span>
        </a>
      </div>

      {recentItems.length > 0 && (
        <div style={{ marginTop: 50 }}>
          <h2 className="lum-cart-summary-title">Recently Viewed</h2>
          <div className="lum-results-grid" style={{ marginTop: 20 }}>
            {recentItems.map(p => (
              <ProductCard key={p.sku} product={p} wished={!!wished[p.sku]} onToggleWish={toggleWish} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
