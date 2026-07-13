import Header from '@/components/layout/Header';
import { Skeleton } from '@/features/shared/Skeleton';

export default function Loading() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-cart">
          <Skeleton style={{ width: 260, height: 38 }} />
          <Skeleton style={{ width: 180, height: 14, marginTop: 12 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 34 }}>
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} style={{ width: '100%', height: 96, borderRadius: 8 }} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
