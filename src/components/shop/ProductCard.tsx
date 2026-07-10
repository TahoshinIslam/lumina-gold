'use client';

import Link from 'next/link';
import { Product, formatPrice } from './types';

/**
 * ProductCard — grid tile used on listing pages and "You may also like".
 * Wishlist state is lifted to the parent (persisted in localStorage there).
 */
export default function ProductCard({
  product,
  wished,
  onToggleWish,
}: {
  product: Product;
  wished: boolean;
  onToggleWish: (sku: string) => void;
}) {
  return (
    <div className="lum-prod-card lum-pcard">
      {product.isNew && <div className="lum-pcard-badge">New</div>}

      <button
        className="lum-wish"
        aria-label={`Add ${product.name} to wishlist`}
        aria-pressed={wished}
        onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleWish(product.sku); }}
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill={wished ? '#C89B3C' : 'none'}
          stroke="#A8863D" strokeWidth="1.5"
          style={{ pointerEvents: 'none' }}
        >
          <path d="M12 21C12 21 3 14.5 3 8.8C3 5.6 5.5 3.5 8 3.5C9.8 3.5 11.3 4.5 12 6C12.7 4.5 14.2 3.5 16 3.5C18.5 3.5 21 5.6 21 8.8C21 14.5 12 21 12 21Z" />
        </svg>
      </button>

      <Link href={`/product/${product.sku}`} className="lum-pcard-link">
        <div className="lum-prod-media">
          <div className="lum-prod-zoom lum-img-ph">
            <img src={product.images[0]} alt={product.name} />
          </div>
        </div>
        <div className="lum-prod-body">
          <div className="lum-pcard-meta">
            {[product.purity, product.material, product.type].filter(Boolean).join(' · ')}
          </div>
          <div className="lum-prod-name">{product.name}</div>
          <div className="lum-prod-price">{formatPrice(product.price)}</div>
          {product.availability !== 'In Stock' && (
            <div className="lum-pcard-avail">{product.availability}</div>
          )}
        </div>
      </Link>
    </div>
  );
}
