import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/lumina/Header';
import Footer from '@/components/lumina/Footer';
import ShopPage from '@/components/shop/ShopPage';
import { CATEGORY_SLUGS, pluralType } from '@/components/shop/taxonomy';

/** Pre-render one page per jewellery category slug. */
export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map(type => ({ type }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ type: string }> },
): Promise<Metadata> {
  const { type } = await params;
  const jewelleryType = CATEGORY_SLUGS[type];
  return { title: jewelleryType ? `${pluralType(jewelleryType)} — LUMINA` : 'LUMINA' };
}

/** /categories/[type] — a category landing view of the boutique. */
export default async function CategoryPage(
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const jewelleryType = CATEGORY_SLUGS[type];
  if (!jewelleryType) notFound();

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <Suspense>
          <ShopPage
            lockedFilters={{ type: [jewelleryType] }}
            heading={pluralType(jewelleryType)}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
