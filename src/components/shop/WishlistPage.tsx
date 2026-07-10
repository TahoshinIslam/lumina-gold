'use client';

import Link from 'next/link';
import { useStore } from './StoreContext';
import { getProductBySku } from './catalog';
import { Product } from './types';
import ProductCard from './ProductCard';

export default function WishlistPage() {
  const { wished, toggleWish } = useStore();
  const items = Object.entries(wished)
    .filter(([, on]) => on)
    .map(([sku]) => getProductBySku(sku))
    .filter((p): p is Product => !!p);

  return (
    <div className="lum-cart">
      <h1 className="lum-h2 lum-listing-title">Your Wishlist</h1>
      <div className="lum-listing-count">{items.length} {items.length === 1 ? 'saved piece' : 'saved pieces'}</div>

      {items.length === 0 ? (
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
