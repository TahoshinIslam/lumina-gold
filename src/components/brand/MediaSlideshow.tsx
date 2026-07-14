'use client';

import { useEffect, useState } from 'react';
import type { SlideImage } from '@/server/dal/home';
import { optimized } from '@/features/shared/optimized';

const INTERVAL_MS = 5200;

/**
 * The framed image inside an editorial section (a Collections card, the
 * Savoir-Faire or Heritage figure). One image renders as a plain photo; several
 * cross-fade, which is what turns the admin's Home Models gallery into a
 * carousel without touching the surrounding layout.
 *
 * It renders the FRAME, not just its contents, because the frame has to take
 * the shape of the photo. The frames used to have a fixed aspect-ratio in CSS
 * (3:4.1, 4:5) and photos were cropped into them — heads and edges got cut off.
 * Now the first photo's own proportions set the frame, and every image is fitted
 * inside it whole (`contain`), so nothing is ever trimmed.
 *
 * All the images sit in the DOM at once and only opacity animates: the frame
 * carries a hover-zoom transform, and swapping a single <img>'s src would flash
 * and fight the zoom.
 */
export default function MediaSlideshow({ images, alt, className, renderWidth = 1200 }: {
  images: SlideImage[];
  alt: string;
  className?: string;
  /** The widest this frame is ever painted, x2 for retina. The optimizer resizes
   *  to it, so a card never downloads more pixels than it can show. */
  renderWidth?: number;
}) {
  const [current, setCurrent] = useState(0);
  // A file that has been deleted from disk while its row still points at it
  // would otherwise leave an empty frame (or a browser's broken-image glyph) in
  // the middle of the page. Drop it and let the gradient behind show through.
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (images.length < 2) return;
    // Someone who asked for less motion gets the first image, held still.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setCurrent(n => (n + 1) % images.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  // The shipped stills carry no dimensions — those frames keep their CSS ratio.
  const shaper = images.find(image => image.width && image.height);
  const style = shaper ? { aspectRatio: `${shaper.width} / ${shaper.height}` } : undefined;

  return (
    <div className={`lum-slides ${className ?? ''}`} style={style}>
      {images.filter(image => !broken[image.src]).map((image, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image.src}
          className={`lum-slide${index === current ? ' is-on' : ''}`}
          // Through the optimizer: AVIF/WebP, and at the width this frame is
          // actually painted at rather than the full-size original. A Collections
          // card is ~411px wide even on a 1920 screen — sending it a 1200px JPEG
          // is three times the pixels it can show, and on the home page there are
          // seven of these.
          src={optimized(image.src, renderWidth)}
          onError={() => setBroken(b => ({ ...b, [image.src]: true }))}
          // Only the visible one is announced; the rest are decorative duplicates.
          alt={index === current ? alt : ''}
          aria-hidden={index !== current}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}
