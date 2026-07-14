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
export function optimized(src: string | undefined, width: number): string | undefined {
  if (!src) return undefined;
  // Only what we serve out of /uploads. A shipped still named in the stylesheet,
  // or an absolute URL, is handed back untouched — the optimizer would refuse a
  // path it has not been told to allow.
  if (!src.startsWith('/uploads/')) return src;

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
  return `/_next/image?url=${encodeURIComponent(path)}&w=${width}&q=75${bust}`;
}

/** The widths the backdrops are actually painted at. The backdrop IS the
 *  viewport, so a desktop wants a wide rendition and a phone a narrow one —
 *  asking for 2048 on a 390px screen is five times the pixels for nothing. */
export const BACKDROP_WIDTH = 1920;
export const BACKDROP_PHONE_WIDTH = 828;
