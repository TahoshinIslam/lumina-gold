'use client';

import { useStore } from './StoreContext';

/**
 * Wishlist hook — thin wrapper over the shared StoreContext so existing
 * callers (ShopPage, ProductCard, ProductDetail, BestSellers) keep the
 * same { wished, toggleWish } API while state is now shared reactively
 * across the whole app (header badge, wishlist page).
 */
export function useWishlist() {
  const { wished, toggleWish } = useStore();
  return { wished, toggleWish };
}
