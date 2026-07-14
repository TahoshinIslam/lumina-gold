import { HERITAGE_STATS } from '@/components/brand/data';
import MediaSlideshow from '@/components/brand/MediaSlideshow';
import type { SlideImage } from '@/server/dal/home';

/**
 * Heritage — "Four Decades of Light": maison history, count-up stats
 * (years / artisans / maisons) and the archive photograph, which the admin
 * sets under Home Models → Heritage.
 */
export default function Heritage({ images }: { images: SlideImage[] }) {
  return (
    <section id="heritage" className="lum-heritage">
      <div className="lum-split">
        {/* Copy + stats */}
        <div className="lum-split-copy" data-reveal="stagger">
          <div className="lum-eyebrow">
            <div className="lum-rule lum-rule--solid" />
            <div className="lum-eyebrow-label">Heritage</div>
          </div>
          <h2 className="lum-h2">Four Decades of Light</h2>
          <p className="lum-body-text">
            Founded in 1985 in a single Parisian workshop, Nahar Jewellers began with one conviction:
            that gold and diamonds, in the right hands, could hold light the way memory holds
            a moment.
          </p>
          <p className="lum-body-text">
            Today our maison spans three cities, yet every creation still passes through the
            same unhurried rituals — drawn gold, hand-cut stones, and a final inspection by
            candlelight.
          </p>
          <div className="lum-heritage-stats">
            {HERITAGE_STATS.map(stat => (
              <div key={stat.label} className="lum-heritage-stat">
                <div className="lum-heritage-num">
                  <span data-count={stat.value}>0</span>
                </div>
                <div className="lum-heritage-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Archive photo */}
        <div className="lum-figure" data-reveal="right">
          <div className="lum-figure-outline lum-figure-outline--heritage" />
          <div className="lum-figure-media">
            <MediaSlideshow renderWidth={1200} className="lum-figure-zoom lum-img-ph" images={images} alt="Heritage archive photograph" />
          </div>
        </div>
      </div>
    </section>
  );
}
