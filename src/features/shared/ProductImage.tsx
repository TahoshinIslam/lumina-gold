import Image from 'next/image';

/**
 * A product photograph rendered through next/image for a genuine responsive
 * srcset — the browser downloads the rendition that fits the slot, not one
 * fixed width for every screen.
 *
 * It uses `fill`, because a product image's dimensions are not known at build
 * time (they are uploaded, any aspect ratio). The PARENT therefore must be
 * `position: relative` with a height — every call site here is an
 * `aspect-ratio` box that already reserves the space, which is also what keeps
 * CLS at zero. `object-fit: cover` comes from the shared `.lum-img-ph img` rule.
 *
 * `sizes` is required with `fill` and is the whole point: it tells the browser
 * how wide the image will actually paint at each breakpoint, so it can pick the
 * right srcset entry. Pass the real painted width per layout.
 *
 * The one non-photo case: `firstImage()` falls back to an SVG placeholder when a
 * product has no image. Next will not run SVG through its optimizer without the
 * global `dangerouslyAllowSVG` switch (which we don't want — it would allow it
 * for everything), and a vector needs no resizing anyway, so it is served as-is.
 * Every real product photo is a raster upload and gets the full treatment.
 */
export default function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith('.svg')}
    />
  );
}
