import { CSSProperties } from 'react';

/** Four-point star used for the twinkles around "Luxury". */
function Star({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <svg className="lum-twinkle" width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden>
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="#F0D9A6" />
    </svg>
  );
}

/**
 * Hero — full-bleed editorial: the opening photograph (cover, centered) under a
 * dark gradient scrim, with ivory-white typography. Stacked headline (ETERNAL /
 * Luxury / REDEFINED), subheadline, two CTAs. Animation delays follow the 1.2s
 * preloader lift.
 *
 * Both photographs come from Admin → Home Models. The stylesheet still names the
 * shipped one, so with nothing uploaded the page looks exactly as it always has;
 * an upload simply paints over it.
 *
 * Two of them, because the backdrop IS the viewport (position: fixed, inset: 0,
 * background cover) and a phone's viewport is about 9:19. Covering that with a
 * 16:9 photograph keeps only the middle quarter of its width — the piece it was
 * shot to show ends up outside the frame. `phoneImage` is the upright crop for
 * those screens; the CHOICE between them is made in CSS (a media query), not
 * here, because a server component cannot know the screen it will land on and
 * guessing from a user-agent gets it wrong on the ones that matter.
 */
export default function Hero({ image, phoneImage }: { image?: string; phoneImage?: string }) {
  // Custom properties, so one element can carry both and the stylesheet picks.
  // An unset property falls back to the shipped photograph named in the CSS.
  const backdrop = {
    ...(image ? { '--lum-bg': `url('${image}')` } : {}),
    // With no upright crop, phones keep the wide one — today's behaviour exactly.
    ...(phoneImage ? { '--lum-bg-phone': `url('${phoneImage}')` } : {}),
  } as CSSProperties;

  return (
    <section className="lum-hero" id="hero">
      {/* Fixed image layer (GPU-composited parallax; clipped by the section) */}
      <div className="lum-fixed-bg lum-fixed-bg--hero" style={backdrop} aria-hidden />
      <div className="lum-hero-ghost">NAHAR</div>

      {/* Eyebrow label */}
      <div className="lum-hero-label">
        <div className="lum-rule lum-rule--l" />
        <div className="lum-hero-label-text">Est. 1985 &nbsp;•&nbsp; Haute Joaillerie</div>
        <div className="lum-rule lum-rule--r" />
      </div>

      {/* Headline */}
      <h1 className="lum-hero-h1">
        <span className="lum-hero-line">
          <span
            className="lum-hero-word"
            style={{ '--rise-delay': '1.5s', '--shimmer-delay': '3s' } as CSSProperties}
          >
            ETERNAL
          </span>
        </span>
        <span className="lum-hero-line lum-hero-line--mid">
          <span className="lum-mask-rise" style={{ '--rise-delay': '1.8s' } as CSSProperties}>
            <span className="lum-hero-script">Luxury</span>
            <Star size={22} style={{ top: '8%', left: '-3%', '--tw-dur': '2.8s', '--tw-delay': '3.2s' } as CSSProperties} />
            <Star size={15} style={{ top: '-6%', right: '12%', '--tw-dur': '3.3s', '--tw-delay': '3.8s' } as CSSProperties} />
            <Star size={18} style={{ bottom: '4%', right: '-2%', '--tw-dur': '2.4s', '--tw-delay': '4.4s' } as CSSProperties} />
            <Star size={12} style={{ bottom: '18%', left: '16%', '--tw-dur': '3.7s', '--tw-delay': '5s' } as CSSProperties} />
          </span>
        </span>
        <span className="lum-hero-line">
          <span
            className="lum-hero-word"
            style={{ '--rise-delay': '2.1s', '--shimmer-delay': '3.3s' } as CSSProperties}
          >
            REDEFINED
          </span>
        </span>
      </h1>

      {/* Subheadline */}
      <p className="lum-hero-sub">
        Masterfully crafted gold &amp; flawless diamonds
        <br />
        for those who seek only the extraordinary
      </p>

      {/* CTAs */}
      <div className="lum-hero-ctas">
        <a
          href="#collections"
          className="lum-cta-gold"
          data-magnetic=""
          style={{ '--sheen-delay': '3.4s' } as CSSProperties}
        >
          Discover the Collection
        </a>
        <a href="#appointment" className="lum-cta-ghost" data-magnetic="">
          Private Appointment
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="lum-scroll-hint" data-reveal="up" data-reveal-delay="0.2">
        <div className="lum-scroll-hint-text">Scroll to explore</div>
        <div className="lum-scroll-hint-line" />
      </div>
    </section>
  );
}
