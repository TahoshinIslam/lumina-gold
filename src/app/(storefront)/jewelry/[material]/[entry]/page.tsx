import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopPage from '@/features/catalog/components/ShopPage';
import { allPresetParams, findPreset } from '@/features/catalog/presets';
import { presetCrumbs } from '@/features/catalog/breadcrumbs';
import type { MainCategory } from '@/server/dal/catalog';
import { getListing } from '@/server/dal/browse';

// Live DB data — see src/app/(storefront)/shop/page.tsx.
export const dynamic = 'force-dynamic';

const MAIN_CATEGORY_SLUGS: Record<string, MainCategory> = { gold: 'gold', platinum: 'platinum', silver: 'silver', diamond: 'diamond' };

/**
 * /jewelry/[material]/[entry] — the canonical landing page for a merchandised
 * entry point ("Gold Ring", "Diamond Nosepin", "Platinum Churi").
 *
 * Each is a preset over existing facets, not a category: the route locks the
 * filter and ShopPage keeps every *other* facet (purity, price, occasion…)
 * live on top of it.
 */

export function generateStaticParams() {
  return allPresetParams();
}

export async function generateMetadata(
  { params }: { params: Promise<{ material: string; entry: string }> },
): Promise<Metadata> {
  const { material, entry } = await params;
  const hit = findPreset(material, entry);
  if (!hit) return { title: 'Nahar Jewellers' };
  return {
    title: `${hit.preset.label} — Nahar Jewellers`,
    description: `Explore ${hit.preset.label} at Nahar Jewellers — reserved for a private viewing, collection, or insured delivery.`,
  };
}

export default async function PresetLandingPage(
  { params, searchParams }: {
    params: Promise<{ material: string; entry: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  },
) {
  const { material, entry } = await params;
  const hit = findPreset(material, entry);
  if (!hit) notFound();

  const listing = await getListing({
    searchParams: await searchParams,
    lockedFilters: hit.filters,
    heading: hit.preset.label,
    mainCategory: MAIN_CATEGORY_SLUGS[material],
  });

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <Suspense>
          <ShopPage listing={listing} crumbs={presetCrumbs(material, entry)} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
