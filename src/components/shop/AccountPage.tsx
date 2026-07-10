'use client';

import Link from 'next/link';
import { useStore } from './StoreContext';
import { getProductBySku } from './catalog';
import { Product } from './types';
import ProductCard from './ProductCard';

/**
 * AccountPage — a guest account hub. Full customer sign-in/registration is
 * planned; for now it surfaces the shopper's saved items, recently viewed,
 * and bag, all from the shared store.
 */
export default function AccountPage() {
  const { wished, wishCount, cartCount, recent, toggleWish } = useStore();
  const recentItems = recent
    .map(getProductBySku)
    .filter((p): p is Product => !!p)
    .slice(0, 4);

  return (
    <div className="lum-cart">
      <h1 className="lum-h2 lum-listing-title">My Account</h1>
      <p className="lum-pdp-desc" style={{ maxWidth: 520 }}>
        Personal sign-in is arriving soon. In the meantime, your saved pieces and recently
        viewed creations are kept on this device.
      </p>

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
