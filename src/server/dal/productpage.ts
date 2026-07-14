import { unstable_cache } from 'next/cache';
import { getRelatedProducts, getFeaturedProducts } from '@/server/dal/catalog';
import type { Product } from '@/types/product';

/**
 * The two rails beside a product — "related pieces" and "You May Also Admire".
 *
 * Ten of the product page's nineteen queries are these, and they are the least
 * urgent thing on the page: a browse rail, the same for every visitor, changing
 * only when an admin edits the catalogue. So they are cached and the piece itself
 * is not.
 *
 * That split is deliberate. The product you are actually looking at keeps asking
 * the database on every request, because its STOCK and its PRICE have to be true
 * — a rate-based piece is repriced whenever the gold rate moves, and a piece that
 * has just sold out must say so on the page where somebody is about to buy it. A
 * rail of other pieces can be a minute out of date without anybody being misled.
 *
 * Keyed on the three things the rails actually depend on — the piece's type, its
 * collection, and its own SKU (to exclude itself) — and NOT on the whole product.
 * The product object carries stock, so keying on it would mint a new cache entry
 * every time anything sold, which is a cache that never hits.
 */
export const PRODUCT_RAILS_TAG = 'product-rails';

const cachedRails = unstable_cache(
  async (sku: string, type: string, collection: string): Promise<[Product[], Product[]]> => {
    // getRelatedProducts only reads these three fields off the product.
    const stub = { sku, type, collection } as Product;
    return Promise.all([
      getRelatedProducts(stub),
      getFeaturedProducts(12, sku),
    ]);
  },
  ['product-rails'],
  { tags: [PRODUCT_RAILS_TAG], revalidate: 60 },
);

export function getProductRails(product: Product): Promise<[Product[], Product[]]> {
  return cachedRails(product.sku, product.type, product.collection);
}
