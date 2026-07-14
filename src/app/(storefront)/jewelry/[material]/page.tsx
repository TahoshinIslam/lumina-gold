import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopPage from '@/features/catalog/components/ShopPage';
import type { Filters } from '@/features/catalog/filtering';
import { GEMSTONE_SLUGS, MATERIAL_SLUGS } from '@/features/catalog/taxonomy';
import type { MainCategory } from '@/server/dal/catalog';
import { getListing } from '@/server/dal/browse';

// Live DB data per material/gemstone — see src/app/(storefront)/shop/page.tsx.
export const dynamic = 'force-dynamic';

/** Pre-render one page per metal + gemstone slug. */
export function generateStaticParams() {
  return [...Object.keys(MATERIAL_SLUGS), ...Object.keys(GEMSTONE_SLUGS)]
    .map(material => ({ material }));
}

/** Slugs the DB read layer can scope a query by directly (Gold/Diamond/Platinum/Silver). */
const MAIN_CATEGORY_SLUGS: Record<string, MainCategory> = { gold: 'gold', platinum: 'platinum', silver: 'silver', diamond: 'diamond' };

/** Resolve a /jewelry/[material] slug to a locked filter + heading. */
function resolve(material: string):
  { filters: Filters; heading: string; crumb: string; mainCategory?: MainCategory } | null {
  if (material in MATERIAL_SLUGS) {
    const metal = MATERIAL_SLUGS[material];
    return { filters: { material: [metal] }, heading: `${metal} Jewellery`, crumb: metal, mainCategory: MAIN_CATEGORY_SLUGS[material] };
  }
  if (material in GEMSTONE_SLUGS) {
    const gem = GEMSTONE_SLUGS[material];
    return { filters: { gemstone: [gem] }, heading: `${gem} Jewellery`, crumb: gem, mainCategory: MAIN_CATEGORY_SLUGS[material] };
  }
  return null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ material: string }> },
): Promise<Metadata> {
  const { material } = await params;
  const resolved = resolve(material);
  return { title: resolved ? `${resolved.heading} — Nahar Jewellers` : 'Nahar Jewellers' };
}

/** /jewelry/[material] — a material/gemstone landing view of the boutique. */
export default async function JewelryMaterialPage(
  { params, searchParams }: {
    params: Promise<{ material: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  },
) {
  const { material } = await params;
  const resolved = resolve(material);
  if (!resolved) notFound();

  const listing = await getListing({
    searchParams: await searchParams,
    lockedFilters: resolved.filters,
    heading: resolved.heading,
    mainCategory: resolved.mainCategory,
  });

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <Suspense>
          <ShopPage
            listing={listing}
            crumbs={[{ label: 'Home', href: '/' }, { label: resolved.crumb }]}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
