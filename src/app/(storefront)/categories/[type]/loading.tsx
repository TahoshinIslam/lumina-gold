import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ProductGridSkeleton, Skeleton } from '@/features/shared/Skeleton';

export default function Loading() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-listing">
          <div className="lum-listing-head">
            <div>
              <Skeleton style={{ width: 200, height: 34 }} />
              <Skeleton style={{ width: 90, height: 13, marginTop: 10 }} />
            </div>
          </div>
          <ProductGridSkeleton count={6} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
