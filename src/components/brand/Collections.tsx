import { COLLECTIONS } from '@/components/brand/data';

/**
 * Collections — "Three Expressions of Light". Staggered card grid
 * (2nd and 3rd cards are pushed down via CSS nth-child margins) with
 * 3D tilt + glare on hover.
 */
export default function Collections() {
  return (
    <section id="collections" className="lum-collections">
      <div className="lum-collections-inner">
        {/* Section header */}
        <div className="lum-collections-head" data-reveal="left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="lum-eyebrow">
              <div className="lum-rule lum-rule--solid" />
              <div className="lum-eyebrow-label">The Collections</div>
            </div>
            <h2 className="lum-h2">
              Three Expressions
              <br />
              of Light
            </h2>
          </div>
          <div className="lum-collections-note">
            Each collection is a study in how gold holds warmth, and how a diamond returns it.
          </div>
        </div>

        {/* Cards */}
        <div className="lum-col-grid">
          {COLLECTIONS.map(collection => (
            <div key={collection.number} className="lum-col-card" data-reveal="clip" data-tilt="">
              <div className="lum-col-media">
                <div className="lum-col-zoom lum-img-ph">
                  <img src={collection.src} alt={collection.alt} />
                </div>
                <div className="lum-glare" data-glare="" />
                <div className="lum-col-badge">{collection.number}</div>
              </div>
              <div className="lum-col-body">
                <h3 className="lum-col-title">{collection.name}</h3>
                <p className="lum-col-desc">{collection.description}</p>
                <div className="lum-col-explore">
                  Explore <span style={{ fontSize: 15 }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
