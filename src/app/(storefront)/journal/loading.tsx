import Header from '@/components/layout/Header';
import { Skeleton } from '@/features/shared/Skeleton';

export default function Loading() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-listing">
          <div className="lum-listing-head">
            <div>
              <Skeleton style={{ width: 110, height: 11 }} />
              <Skeleton style={{ width: 300, height: 36, marginTop: 12 }} />
            </div>
          </div>
          <div className="lum-journal-grid">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="lum-journal-card" style={{ pointerEvents: 'none' }}>
                <Skeleton style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: 0 }} />
                <div className="lum-journal-body">
                  <Skeleton style={{ width: '45%', height: 11 }} />
                  <Skeleton style={{ width: '85%', height: 20 }} />
                  <Skeleton style={{ width: '100%', height: 34 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
