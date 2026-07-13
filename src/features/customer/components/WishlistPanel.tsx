'use client';

import Link from 'next/link';
import { useStore } from '@/stores/StoreContext';
import { getProductBySku } from '@/features/catalog/catalog';
import ProductCard from '@/features/catalog/components/ProductCard';
import type { Product } from '@/types/product';

/** Wishlist tab. The list is device-local (localStorage), which is why it is a
 *  client component and not a table — see StoreContext. */
export default function WishlistPanel() {
  const { wished, toggleWish } = useStore();
  const saved = Object.keys(wished)
    .filter(sku => wished[sku])
    .map(getProductBySku)
    .filter((p): p is Product => !!p);

  if (!saved.length) {
    return (
      <div className="lum-empty-results">
        Nothing saved yet.
        <div style={{ marginTop: 20 }}>
          <Link href="/shop" className="lum-cta-gold">Explore the Boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="lum-cart-summary-title">Saved pieces</h2>
      <div className="lum-results-grid" style={{ marginTop: 20 }}>
        {saved.map(product => (
          <ProductCard key={product.sku} product={product} wished onToggleWish={toggleWish} />
        ))}
      </div>
    </div>
  );
}
