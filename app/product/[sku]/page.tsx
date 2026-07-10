import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '../../../components/lumina/Header';
import Footer from '../../../components/lumina/Footer';
import ProductDetail from '../../../components/shop/ProductDetail';
import { CATALOG, getProductBySku } from '../../../components/shop/catalog';

export function generateStaticParams() {
  return CATALOG.map(product => ({ sku: product.sku }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ sku: string }> },
): Promise<Metadata> {
  const { sku } = await params;
  const product = getProductBySku(sku);
  return { title: product ? `${product.name} — LUMINA` : 'LUMINA' };
}

/** /product/[sku] — premium product detail page (IA spec Step 10). */
export default async function ProductPage(
  { params }: { params: Promise<{ sku: string }> },
) {
  const { sku } = await params;
  const product = getProductBySku(sku);
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
