import Header from '@/components/layout/Header';
import { ShowcaseSkeleton, Skeleton } from '@/features/shared/Skeleton';

/**
 * The home page reads ten things (both showcases, the category tiles, the
 * editorial imagery, the Journal, the campaign). This holds its shape while
 * that happens, instead of a white screen.
 */
export default function Loading() {
  return (
    <div className="lum-root">
      <Header />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <section className="lum-skel-hero" aria-hidden="true">
          <Skeleton style={{ width: 'min(560px, 80%)', height: 64 }} />
          <Skeleton style={{ width: 'min(420px, 60%)', height: 64 }} />
          <Skeleton style={{ width: 'min(460px, 70%)', height: 14, marginTop: 10 }} />
          <Skeleton style={{ width: 200, height: 48, marginTop: 20, borderRadius: 3 }} />
        </section>

        {/* Shop by category */}
        <section className="lum-cats" aria-hidden="true">
          <Skeleton style={{ width: 260, height: 34, margin: '0 auto' }} />
          <div className="lum-cats-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="lum-cat">
                <Skeleton className="lum-skel-circle" />
                <Skeleton style={{ width: 70, height: 11 }} />
              </div>
            ))}
          </div>
        </section>

        <ShowcaseSkeleton />
      </div>
    </div>
  );
}
