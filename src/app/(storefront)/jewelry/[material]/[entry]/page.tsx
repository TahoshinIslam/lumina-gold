import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopPage from '@/features/catalog/components/ShopPage';
import { allPresetParams, findPreset } from '@/features/catalog/presets';
import { presetCrumbs } from '@/features/catalog/breadcrumbs';
import { getFacetOptions, getStorefrontProducts, type MainCategory } from '@/server/dal/catalog';

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
  { params }: { params: Promise<{ material: string; entry: string }> },
) {
  const { material, entry } = await params;
  const hit = findPreset(material, entry);
  if (!hit) notFound();

  const mainCategory = MAIN_CATEGORY_SLUGS[material];
  const [products, facetOptions] = await Promise.all([
    getStorefrontProducts({ mainCategory }),
    getFacetOptions({ mainCategory }),
  ]);

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <Suspense>
          <ShopPage
            lockedFilters={hit.filters}
            heading={hit.preset.label}
            crumbs={presetCrumbs(material, entry)}
            initialProducts={products}
            facetOptions={facetOptions}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
