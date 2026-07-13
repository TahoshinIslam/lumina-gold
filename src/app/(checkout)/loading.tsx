import Header from '@/components/layout/Header';
import { Skeleton } from '@/features/shared/Skeleton';

export default function Loading() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-cart">
          <Skeleton style={{ width: 220, height: 38 }} />
          <div className="lum-checkout-grid">
            <div className="lum-checkout-main">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} style={{ width: '100%', height: 150, borderRadius: 8 }} />
              ))}
            </div>
            <Skeleton style={{ width: '100%', height: 420, borderRadius: 8 }} />
          </div>
        </div>
      </main>
    </div>
  );
}
