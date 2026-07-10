import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductDetail from '@/features/product/components/ProductDetail';
import { CATALOG, getProductBySlug } from '@/features/catalog/catalog';

export function generateStaticParams() {
  return CATALOG.map(product => ({ slug: product.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? `${product.name} — LUMINA` : 'LUMINA' };
}

/** /products/[slug] — premium product detail page (IA spec Step 10). */
export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  );
}
