import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopPage from '@/features/catalog/components/ShopPage';
import { getFacetOptions, getStorefrontProducts } from '@/server/dal/catalog';

export const metadata: Metadata = {
  title: 'The Boutique — Nahar Jewellers',
  description: 'Shop gold and diamond haute joaillerie by category, purity, color, occasion and price.',
};

// Always read the live database — a product added/edited/deleted in the
// admin must show up on the very next request, never a stale static build.
export const dynamic = 'force-dynamic';

/**
 * /shop — the single listing route. Every mega-menu entry, collection,
 * occasion and recipient page is this route with preset query filters.
 */
export default async function Shop() {
  const [products, facetOptions] = await Promise.all([
    getStorefrontProducts(),
    getFacetOptions(),
  ]);
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <Suspense>
          <ShopPage initialProducts={products} facetOptions={facetOptions} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
