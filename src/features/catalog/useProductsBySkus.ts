'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/types/product';

/**
 * Resolve a list of SKUs to live products.
 *
 * The bag, the wishlist and "recently viewed" are device-local: localStorage
 * holds SKUs and nothing else, so every one of those screens needs a way to turn
 * a SKU into a product. They each used to do it against the hardcoded mock
 * catalogue, which meant a piece a customer had actually saved — a real SKU from
 * the database — resolved to nothing and simply did not appear. The wishlist
 * looked empty to anyone who had used it.
 *
 * They now all go through here, to the database, via /api/products/lookup.
 *
 * A SKU that comes back with nothing is dropped rather than rendered blank: it
 * means the admin has since deleted or deactivated that piece, and a wishlist is
 * allowed to shrink when the boutique stops selling something.
 */
export function useProductsBySkus(skus: string[]): { products: Product[]; loading: boolean } {
  // The array is rebuilt on every render by every caller (Object.keys(wished), …),
  // so everything here keys on its CONTENT. Keyed on the array itself, the effect
  // would refetch in a loop, forever.
  const key = skus.join(',');

  // What we hold is the answer TO A PARTICULAR KEY, so "am I still loading?" is a
  // question the state can answer by itself — no loading flag to set, and no way
  // for the previous key's products to be shown against the current one.
  const [answer, setAnswer] = useState<{ key: string; products: Product[] }>({ key: '', products: [] });

  const settled = answer.key === key;
  const products = settled ? answer.products : [];
  const loading = !settled && key !== '';

  useEffect(() => {
    if (!key) return;

    let cancelled = false;
    const list = key.split(',');

    fetch(`/api/products/lookup?skus=${list.map(encodeURIComponent).join(',')}`)
      .then(res => res.json())
      .then((data: { products?: Product[] }) => {
        if (cancelled) return;
        // Restore the caller's order — the database returns rows in its own, and
        // "recently viewed" is meaningless if it is not in the order viewed.
        const bySku = new Map((data.products ?? []).map(p => [p.sku, p]));
        setAnswer({ key, products: list.map(sku => bySku.get(sku)).filter((p): p is Product => !!p) });
      })
      .catch(() => {
        // Offline or the lookup failed: an empty shelf, not a broken page.
        if (!cancelled) setAnswer({ key, products: [] });
      });

    return () => { cancelled = true; };
  }, [key]);

  return { products, loading };
}
