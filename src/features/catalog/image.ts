import type { Product } from '@/types/product';

/** Shown whenever a product has no images left (deleted, or never uploaded). */
export const PLACEHOLDER_IMAGE = '/images/product-placeholder.svg';

/** First product image, or the placeholder — never a broken/undefined `src`. */
export function firstImage(product: Pick<Product, 'images'>): string {
  return product.images[0] || PLACEHOLDER_IMAGE;
}
