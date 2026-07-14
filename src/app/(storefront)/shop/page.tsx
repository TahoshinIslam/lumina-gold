import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopPage from '@/features/catalog/components/ShopPage';
import { getListing } from '@/server/dal/browse';

export const metadata: Metadata = {
  title: 'The Boutique — Nahar Jewellers',
  description: 'Shop gold and diamond haute joaillerie by category, purity, color, occasion and price.',
};

// Rendered per request — the query string IS the page, and there is one of these
// for every combination of filters. The catalogue behind it is cached, so this
// costs no database read on all but the first request in a minute.
export const dynamic = 'force-dynamic';

/**
 * /shop — the single listing route. Every mega-menu entry, collection,
 * occasion and recipient page is this route with preset query filters.
 *
 * The filtering, counting and paging happen on the SERVER now (dal/browse.ts):
 * this used to hand the whole catalogue to the browser and let it work the
 * listing out, which serialised every product in the shop into every listing page.
 */
export default async function Shop(
  { searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> },
) {
  const listing = await getListing({ searchParams: await searchParams });

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <Suspense>
          <ShopPage listing={listing} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
