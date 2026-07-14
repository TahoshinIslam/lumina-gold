'use client';

import Link from 'next/link';
import { useStore } from '@/stores/StoreContext';
import { useProductsBySkus } from '@/features/catalog/useProductsBySkus';
import ProductCard from '@/features/catalog/components/ProductCard';
import { ProductGridSkeleton } from '@/features/shared/Skeleton';

/** Wishlist tab. The list is device-local (localStorage), which is why it is a
 *  client component and not a table — see StoreContext. */
export default function WishlistPanel() {
  const { wished, toggleWish } = useStore();
  const savedSkus = Object.keys(wished).filter(sku => wished[sku]);
  const { products: saved, loading } = useProductsBySkus(savedSkus);

  if (loading && savedSkus.length > 0) {
    return <ProductGridSkeleton count={Math.min(savedSkus.length, 6)} />;
  }

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
