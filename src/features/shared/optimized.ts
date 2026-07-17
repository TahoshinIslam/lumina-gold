/**
 * Serve an uploaded photograph through Next's image optimizer.
 *
 * The site is photographs, and every one of them was being sent as a raw JPEG at
 * its full stored size: a 1200px product rendition into a 300px card, a 2560px
 * backdrop onto a phone. That was 3.9 MB on the home page, and over a slow
 * connection those bytes ARE the Largest Contentful Paint — the pixels simply
 * have not arrived yet.
 *
 * The optimizer is an HTTP endpoint, not only a <next/image> component, so even
 * a CSS `background-image` can point at it: it re-encodes to AVIF or WebP from
 * the browser's own Accept header, resizes to the width asked for, and caches
 * the result.
 *
 * `width` is the widest the image is ever PAINTED, doubled for a retina screen —
 * not the size it happens to be stored at.
 */
/**
 * Uploads live in Vercel Blob, so the thing to optimize is now an absolute URL
 * on the blob host rather than a local /uploads path.
 *
 * This test is the whole reason the optimizer still gets used. It used to be
 * `startsWith('/uploads/')`, and a blob URL fails that — which does not break
 * anything visibly. It just hands the raw stored JPEG straight to the browser
 * and quietly restores the 3.9 MB home page described above. A regression that
 * only shows up as a slow LCP is one nobody notices for a month.
 *
 * Matched by shape, not by an env var: the store id is a subdomain, and the
 * pattern must stay in step with `images.remotePatterns` in next.config.ts —
 * the optimizer 400s on a host it has not been told to allow.
 */
const BLOB_URL = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//;

/** `/uploads/` is kept for anything not yet migrated and for local fixtures. */
function optimizable(src: string): boolean {
  return src.startsWith('/uploads/') || BLOB_URL.test(src);
}

export function optimized(src: string | undefined, width: number): string | undefined {
  if (!src) return undefined;
  // A shipped still named in the stylesheet, or a third-party URL, is handed
  // back untouched — the optimizer would refuse a host it has not been told
  // to allow.
  if (!optimizable(src)) return src;

  /* Category tiles carry a cache-busting `?v=…`, because re-uploading one keeps
   * the same filename and the browser would otherwise show the old picture. The
   * optimizer rejects a local path with a query on it (400 — it goes looking for
   * a file called "rings.jpg?v=123"), so the version is lifted OUT of the inner
   * url and hung on the optimizer's own URL instead. It is ignored as a
   * parameter but still part of the cache key, so a re-upload is still a
   * different URL and still defeats the cache. Simply dropping it would have
   * pinned every re-uploaded tile to its old picture for a day. */
  const [path, version] = src.split('?');
  const bust = version ? `&${version}` : '';
  return `/_next/image?url=${encodeURIComponent(path)}&w=${allowedWidth(width)}&q=75${bust}`;
}

/**
 * Next's optimizer only serves widths in `deviceSizes ∪ imageSizes` — ask for
 * anything else and it returns a 400, a broken image. This helper accepts a
 * requested width and snaps it UP to the nearest one the optimizer will honour,
 * so a caller can pass the actual painted width (128, 160, 560…) without having
 * to know the config. Snap UP, not down, so the image is never upscaled by the
 * browser and blurred.
 *
 * MUST stay in sync with next.config.ts. imageSizes is left at Next's default
 * (the config does not override it); deviceSizes is the list set there.
 */
const IMAGE_SIZES = [16, 32, 48, 64, 96, 128, 256, 384];
const DEVICE_SIZES = [640, 828, 1080, 1200, 1920, 2048];
const ALLOWED = [...IMAGE_SIZES, ...DEVICE_SIZES].sort((a, b) => a - b);

function allowedWidth(requested: number): number {
  return ALLOWED.find(w => w >= requested) ?? ALLOWED[ALLOWED.length - 1];
}

/** The widths the backdrops are actually painted at. The backdrop IS the
 *  viewport, so a desktop wants a wide rendition and a phone a narrow one —
 *  asking for 2048 on a 390px screen is five times the pixels for nothing. */
export const BACKDROP_WIDTH = 1920;
export const BACKDROP_PHONE_WIDTH = 828;
