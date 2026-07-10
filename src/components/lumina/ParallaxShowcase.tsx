import Link from 'next/link';

/**
 * ParallaxShowcase — full-width editorial break. The lifestyle image is
 * fixed to the viewport (background-attachment: fixed, cover, centered,
 * slightly zoomed) so the beige sections above and below appear to slide
 * over it as the page scrolls. White typography sits on a dark scrim.
 */
export default function ParallaxShowcase() {
  return (
    <section className="lum-parallax" id="editorial">
      {/* Fixed image layer (GPU-composited parallax; clipped by the section) */}
      <div className="lum-fixed-bg lum-fixed-bg--rings" aria-hidden />
      <div className="lum-parallax-content">
        <div className="lum-parallax-eyebrow" data-reveal="tracking">The Editorial</div>
        <h2 className="lum-parallax-title" data-reveal="up">Rings Collections</h2>
        <p className="lum-parallax-sub" data-reveal="up" data-reveal-delay="0.15">
          One stone, one story — set forever in gold
        </p>
        <Link
          href="/shop?type=Ring"
          className="lum-parallax-cta"
          data-magnetic=""
          data-reveal="up"
          data-reveal-delay="0.3"
        >
          Explore the Rings
        </Link>
      </div>
    </section>
  );
}
