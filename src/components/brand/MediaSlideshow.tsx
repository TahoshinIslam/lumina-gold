'use client';

import { useEffect, useState } from 'react';
import type { SlideImage } from '@/server/dal/home';

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
export default function MediaSlideshow({ images, alt, className }: {
  images: SlideImage[];
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);

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
      {images.map((image, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image.src}
          className={`lum-slide${index === current ? ' is-on' : ''}`}
          src={image.src}
          // Only the visible one is announced; the rest are decorative duplicates.
          alt={index === current ? alt : ''}
          aria-hidden={index !== current}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}
