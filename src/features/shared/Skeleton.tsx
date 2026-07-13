/**
 * Loading placeholders.
 *
 * These exist to hold the SHAPE of what is coming, not to entertain: a skeleton
 * whose proportions don't match the real thing just moves the layout twice, and
 * that is worse than a blank space. So each of these mirrors a real component —
 * a product card, a showcase, the product page — and nothing else gets one.
 *
 * Server components: they render on the server as a route's `loading.tsx` while
 * the page's queries run.
 */

/** One shimmering block. Everything below is made of these. */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <span aria-hidden="true" className={`lum-skel ${className ?? ''}`} style={style} />;
}

/** The shape of a ProductCard: image, meta line, name, price. */
export function ProductCardSkeleton() {
  return (
    <div className="lum-skel-card">
      <Skeleton className="lum-skel-media" />
      <Skeleton style={{ width: '55%', height: 10 }} />
      <Skeleton style={{ width: '80%', height: 17 }} />
      <Skeleton style={{ width: '40%', height: 15 }} />
    </div>
  );
}

/** A grid of them, for a listing that is still being read. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="lum-results-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}

/** The Gold/Diamond showcases: heading, tab bar, then cards. */
export function ShowcaseSkeleton() {
  return (
    <section className="lum-shop" aria-hidden="true">
      <div className="lum-shop-inner">
        <div className="lum-shop-head" style={{ alignItems: 'center' }}>
          <Skeleton style={{ width: 220, height: 34 }} />
          <Skeleton style={{ width: 300, height: 13, marginTop: 12 }} />
        </div>
        <div className="lum-skel-tabs">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} style={{ width: 108, height: 32, borderRadius: 999 }} />
          ))}
        </div>
        <div className="lum-prod-grid">
          {Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  );
}

/** The product page: gallery on one side, the buying column on the other. */
export function ProductDetailSkeleton() {
  return (
    <div className="lum-pdp" aria-hidden="true">
      <div className="lum-pdp-grid">
        <div>
          <Skeleton style={{ width: '100%', aspectRatio: '1 / 1.08', borderRadius: 4 }} />
          <div className="lum-skel-thumbs">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} style={{ width: 72, height: 72, borderRadius: 3 }} />
            ))}
          </div>
        </div>

        <div className="lum-skel-buy">
          <Skeleton style={{ width: 140, height: 11 }} />
          <Skeleton style={{ width: '85%', height: 38 }} />
          <Skeleton style={{ width: 180, height: 26 }} />
          <Skeleton style={{ width: '100%', height: 1, marginBlock: 8 }} />
          <Skeleton style={{ width: 120, height: 12 }} />
          <div className="lum-skel-chips">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} style={{ width: 56, height: 40, borderRadius: 3 }} />
            ))}
          </div>
          <Skeleton style={{ width: 120, height: 12, marginTop: 10 }} />
          <div className="lum-skel-chips">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} style={{ width: 48, height: 40, borderRadius: 3 }} />
            ))}
          </div>
          <Skeleton style={{ width: '100%', height: 52, marginTop: 18, borderRadius: 3 }} />
          <Skeleton style={{ width: '100%', height: 80, marginTop: 14, borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );
}
