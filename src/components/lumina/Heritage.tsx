import { HERITAGE_STATS } from './data';

/**
 * Heritage — "Four Decades of Light": maison history, count-up stats
 * (years / artisans / maisons) and the archive photograph.
 */
export default function Heritage() {
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
            Founded in 1985 in a single Parisian workshop, LUMINA began with one conviction:
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
            <div className="lum-figure-zoom lum-img-ph">
              <img src="/uploads/home/heritage-archive.png" alt="Heritage archive photograph" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
