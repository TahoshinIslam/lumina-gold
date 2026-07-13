import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductDetail from '@/features/product/components/ProductDetail';
import { getProductBySlug, getRelatedProducts, getFeaturedProducts } from '@/server/dal/catalog';
import ProductReviews from '@/features/reviews/components/ProductReviews';

// Real variant data (price/stock/SKU per combination), so render on demand.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} — Nahar Jewellers` : 'Nahar Jewellers' };
}

/** /products/[slug] — premium product detail page (IA spec Step 10). */
export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // "You May Also Admire" shows the pieces the boutique has FEATURED (the flag
  // on the product form, which nothing read until now), minus this one.
  const [related, featured] = await Promise.all([
    getRelatedProducts(product),
    getFeaturedProducts(12, product.sku),
  ]);

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <ProductDetail product={product} related={related} featured={featured} />
        {/* Reviews are their own server component so the "has this person
            actually received this piece?" check runs on the server. */}
        <ProductReviews productId={Number(product.id)} />
      </main>
      <Footer />
    </div>
  );
}
