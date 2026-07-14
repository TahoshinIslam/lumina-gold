import Link from 'next/link';
import { CSSProperties } from 'react';

/**
 * ParallaxShowcase — full-width editorial break. The lifestyle image is
 * fixed to the viewport (background-attachment: fixed, cover, centered,
 * slightly zoomed) so the beige sections above and below appear to slide
 * over it as the page scrolls. White typography sits on a dark scrim.
 *
 * Both photographs come from Admin → Home Models ("The Editorial"). This band's
 * image was a filename in the stylesheet and could not be changed from the admin
 * at all; with nothing uploaded the shipped one still shows.
 *
 * `phoneImage` is the upright crop. Same reason as the hero: the backdrop is the
 * viewport, and covering a 9:19 phone screen with a 16:9 photograph throws away
 * most of its width. The stylesheet chooses between them.
 */
export default function ParallaxShowcase({ image, phoneImage }: {
  image?: string;
  phoneImage?: string;
}) {
  const backdrop = {
    ...(image ? { '--lum-bg': `url('${image}')` } : {}),
    ...(phoneImage ? { '--lum-bg-phone': `url('${phoneImage}')` } : {}),
  } as CSSProperties;

  return (
    <section className="lum-parallax" id="editorial">
      {/* Fixed image layer (GPU-composited parallax; clipped by the section) */}
      <div className="lum-fixed-bg lum-fixed-bg--rings" style={backdrop} aria-hidden />
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
