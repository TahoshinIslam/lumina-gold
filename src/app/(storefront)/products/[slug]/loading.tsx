import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ProductDetailSkeleton } from '@/features/shared/Skeleton';

/** Shown while the product, its variants and its reviews are read. */
export default function Loading() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <ProductDetailSkeleton />
      </main>
      <Footer />
    </div>
  );
}
