import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopPage from '@/features/catalog/components/ShopPage';
import { CATEGORY_SLUGS, pluralType } from '@/features/catalog/taxonomy';
import { getListing } from '@/server/dal/browse';

// Live DB data — see src/app/(storefront)/shop/page.tsx.
export const dynamic = 'force-dynamic';

/** Pre-render one page per jewellery category slug. */
export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map(type => ({ type }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ type: string }> },
): Promise<Metadata> {
  const { type } = await params;
  const jewelleryType = CATEGORY_SLUGS[type];
  return { title: jewelleryType ? `${pluralType(jewelleryType)} — Nahar Jewellers` : 'Nahar Jewellers' };
}

/** /categories/[type] — a category landing view of the boutique. */
export default async function CategoryPage(
  { params, searchParams }: {
    params: Promise<{ type: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  },
) {
  const { type } = await params;
  const jewelleryType = CATEGORY_SLUGS[type];
  if (!jewelleryType) notFound();

  const listing = await getListing({
    searchParams: await searchParams,
    lockedFilters: { type: [jewelleryType] },
    heading: pluralType(jewelleryType),
  });

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
