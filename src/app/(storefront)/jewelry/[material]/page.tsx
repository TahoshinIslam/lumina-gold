import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/lumina/Header';
import Footer from '@/components/lumina/Footer';
import ShopPage from '@/components/shop/ShopPage';
import type { Filters } from '@/components/shop/filtering';
import { GEMSTONE_SLUGS, MATERIAL_SLUGS } from '@/components/shop/taxonomy';

/** Pre-render one page per metal + gemstone slug. */
export function generateStaticParams() {
  return [...Object.keys(MATERIAL_SLUGS), ...Object.keys(GEMSTONE_SLUGS)]
    .map(material => ({ material }));
}

/** Resolve a /jewelry/[material] slug to a locked filter + heading. */
function resolve(material: string): { filters: Filters; heading: string } | null {
  if (material in MATERIAL_SLUGS) {
    const metal = MATERIAL_SLUGS[material];
    return { filters: { material: [metal] }, heading: `${metal} Jewellery` };
  }
  if (material in GEMSTONE_SLUGS) {
    const gem = GEMSTONE_SLUGS[material];
    return { filters: { gemstone: [gem] }, heading: `${gem} Jewellery` };
  }
  return null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ material: string }> },
): Promise<Metadata> {
  const { material } = await params;
  const resolved = resolve(material);
  return { title: resolved ? `${resolved.heading} — LUMINA` : 'LUMINA' };
}

/** /jewelry/[material] — a material/gemstone landing view of the boutique. */
export default async function JewelryMaterialPage(
  { params }: { params: Promise<{ material: string }> },
) {
  const { material } = await params;
  const resolved = resolve(material);
  if (!resolved) notFound();

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <Suspense>
          <ShopPage lockedFilters={resolved.filters} heading={resolved.heading} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
