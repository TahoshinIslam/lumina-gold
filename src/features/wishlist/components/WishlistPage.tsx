'use client';

import Link from 'next/link';
import { useStore } from '@/stores/StoreContext';
import { useProductsBySkus } from '@/features/catalog/useProductsBySkus';
import ProductCard from '@/features/catalog/components/ProductCard';
import { ProductGridSkeleton } from '@/features/shared/Skeleton';

export default function WishlistPage() {
  const { wished, toggleWish } = useStore();
  // The saved SKUs are resolved against the DATABASE. They used to be looked up
  // in the hardcoded mock catalogue, so a real saved piece resolved to nothing
  // and the wishlist showed as empty no matter how many hearts had been tapped.
  const savedSkus = Object.entries(wished).filter(([, on]) => on).map(([sku]) => sku);
  const { products: items, loading } = useProductsBySkus(savedSkus);

  return (
    <div className="lum-cart">
      <h1 className="lum-h2 lum-listing-title">Your Wishlist</h1>
      <div className="lum-listing-count">
        {loading && savedSkus.length
          ? 'Loading your pieces…'
          : `${items.length} ${items.length === 1 ? 'saved piece' : 'saved pieces'}`}
      </div>

      {loading && savedSkus.length > 0 ? (
        <div style={{ marginTop: 30 }}>
          <ProductGridSkeleton count={Math.min(savedSkus.length, 8)} />
        </div>
      ) : items.length === 0 ? (
        <div className="lum-empty-results" style={{ marginTop: 30 }}>
          <div className="lum-breathe-diamond" style={{ width: 18, height: 18, margin: '0 auto 20px' }} />
          Nothing saved yet — tap the heart on any creation to keep it here.
          <div style={{ marginTop: 20 }}><Link href="/shop" className="lum-cta-gold">Explore the Boutique</Link></div>
        </div>
      ) : (
        <div className="lum-results-grid" style={{ marginTop: 30 }}>
          {items.map(p => (
            <ProductCard key={p.sku} product={p} wished onToggleWish={toggleWish} />
          ))}
        </div>
      )}
    </div>
  );
}
