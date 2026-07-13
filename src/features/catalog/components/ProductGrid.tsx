'use client';

import Link from 'next/link';
import { useStore } from '@/stores/StoreContext';
import ProductCard from './ProductCard';
import type { Product } from '@/types/product';

/**
 * A grid of product cards. A client component because the card carries the
 * wishlist heart, and the wishlist is device-local (see StoreContext) — the
 * shop page has always done this inline; this is the same thing, extracted so a
 * campaign page doesn't have to reinvent it.
 */
export default function ProductGrid({ products }: { products: Product[] }) {
  const { wished, toggleWish } = useStore();

  if (!products.length) {
    return (
      <div className="lum-empty-results" style={{ marginTop: 30 }}>
        Nothing here yet.
        <div style={{ marginTop: 20 }}>
          <Link href="/shop" className="lum-cta-gold">Explore the Boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lum-results-grid" style={{ marginTop: 24 }}>
      {products.map(product => (
        <ProductCard key={product.sku} product={product}
          wished={!!wished[product.sku]} onToggleWish={toggleWish} />
      ))}
    </div>
  );
}
