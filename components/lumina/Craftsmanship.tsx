import { CRAFT_FEATURES } from './data';

/**
 * Craftsmanship / Savoir-Faire — artisan photo with floating "600+ hours"
 * stat card (count-up on scroll), copy, and a 2×2 feature grid.
 */
export default function Craftsmanship() {
  return (
    <section id="craft" className="lum-craft">
      {/* Decorative background */}
      <div className="lum-drift-blob" style={{ top: '8%', right: '-8%', width: 480, height: 480 }} />
      <div className="lum-craft-year">1985</div>

      <div className="lum-split">
        {/* Photo + stat card */}
        <div className="lum-figure" data-reveal="left">
          <div className="lum-figure-outline lum-figure-outline--craft" />
          <div className="lum-figure-media">
            <div className="lum-figure-zoom lum-img-ph">
              <img src="/uploads/home/craft-artisan.png" alt="Artisan hands setting a diamond" />
            </div>
          </div>
          <div className="lum-stat-card">
            <div className="lum-stat-num">
              <span data-count="600">0</span>+
            </div>
            <div className="lum-stat-label">Hours per creation</div>
          </div>
        </div>

        {/* Copy */}
        <div className="lum-split-copy" data-reveal="stagger">
          <div className="lum-eyebrow">
            <div className="lum-rule lum-rule--solid" />
            <div className="lum-eyebrow-label">Savoir-Faire</div>
          </div>
          <h2 className="lum-h2">One Pair of Hands. Six Hundred Hours.</h2>
          <p className="lum-body-text">
            Each LUMINA creation is entrusted to a single master artisan from first sketch to
            final polish. Gold is drawn, forged and burnished in-house; every diamond is cut to
            reveal its most intense fire before it is ever set.
          </p>
          <div className="lum-feature-grid">
            {CRAFT_FEATURES.map(feature => (
              <div key={feature.title} className="lum-feature">
                <div className="lum-feature-title">{feature.title}</div>
                <div className="lum-feature-desc">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
