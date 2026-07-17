import { put, del, get, head } from '@vercel/blob';

/**
 * Uploaded bytes — every one of them.
 *
 * Uploads used to be written to public/uploads/ with fs.writeFile. That works on
 * a single long-lived server and is a trap anywhere else: a serverless
 * filesystem is per-invocation and thrown away, and public/ is baked at build
 * time. The write SUCCEEDS, the response says ok, and the file is gone by the
 * next request — the worst kind of failure, because nothing errors.
 *
 * Everything now goes to Vercel Blob. The routes keep their own rules (who may
 * upload, magic-byte sniffing, sharp re-encoding, size caps); this module owns
 * only where the bytes land and what comes back.
 *
 * ── Two access levels, and the difference is load-bearing ───────────────────
 *
 *   public   product photos, home art, category tiles, journal images, avatars,
 *            review media. Served straight off the blob CDN and fed through
 *            Next's image optimizer (see src/features/shared/optimized.ts).
 *
 *   private  Certificates of Authenticity. Reachable ONLY through
 *            /api/documents against a signed, expiring URL. `access: 'private'`
 *            is what preserves that: the blob URL alone is not enough, the
 *            request has to carry the store's credentials, which live on the
 *            server. Without it a certificate would be guarded by nothing but an
 *            unguessable URL — and an unguessable URL is still a URL: it leaks
 *            through a Referer header, a shared link, a browser sync.
 *
 * Private blob storage is in PUBLIC BETA at the time of writing. If it is
 * withdrawn, certificates must NOT silently fall back to public — that is the
 * exact failure the private-uploads/ folder was created to fix.
 */

/** One month, the API's own default, stated here so it is a decision. Enough
 *  that a re-render is not re-downloading art; short enough that a mistake ages
 *  out rather than being pinned for a year. Re-uploads defeat it by changing the
 *  URL (random suffix) or by the ?v= buster the category tiles already carry. */
const CACHE_SECONDS = 60 * 60 * 24 * 30;

export type PutResult = { url: string; pathname: string };

/**
 * Store a public asset and return its URL, which is what callers persist.
 *
 * `unique` decides the collision rule, and both halves are deliberate:
 *
 *   true   Blob appends a random suffix, so every upload is a new URL. Used
 *          where the old file must stay reachable until the DB points at the new
 *          one, and where two admins uploading at once must not collide. This is
 *          what replaced the old readdir-and-count numbering in
 *          /api/admin/upload, which was a read-then-write race: two uploads both
 *          counted 2 files, both wrote "3.jpg", and one silently ate the other.
 *
 *   false  A fixed pathname (a category tile is `categories/<slug>.jpg`, because
 *          the slug IS the identity). Requires allowOverwrite, since put()
 *          otherwise throws on an existing pathname. The URL does not change, so
 *          the caller is responsible for cache-busting — the category route hangs
 *          a ?v= on the stored path for exactly this reason.
 */
export async function putPublic(
  pathname: string,
  body: Buffer,
  opts: { contentType: string; unique: boolean },
): Promise<PutResult> {
  const blob = await put(pathname, body, {
    access: 'public',
    contentType: opts.contentType,
    addRandomSuffix: opts.unique,
    allowOverwrite: !opts.unique,
    cacheControlMaxAge: CACHE_SECONDS,
  });
  return { url: blob.url, pathname: blob.pathname };
}

/**
 * Store a private document at a FIXED pathname (one certificate per SKU, so
 * re-uploading replaces it). No URL is returned on purpose: there is no link a
 * caller could keep. Readers go through documentStream() behind a signed URL.
 */
export async function putPrivate(
  pathname: string,
  body: Buffer,
  opts: { contentType: string },
): Promise<void> {
  await put(pathname, body, {
    access: 'private',
    contentType: opts.contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: CACHE_SECONDS,
  });
}

/**
 * The bytes of a private document, or null if there is none.
 *
 * get() resolves to null for a missing blob rather than throwing, so a caller
 * can treat "no certificate" as an ordinary answer instead of an error path.
 */
export async function privateStream(
  pathname: string,
): Promise<{ stream: ReadableStream; contentType: string; size: number } | null> {
  const found = await get(pathname, { access: 'private' });
  if (!found) return null;
  // GetBlobResult is a union discriminated on statusCode: a 304 carries a null
  // stream and null metadata. Only a conditional request (ifNoneMatch) can
  // produce one and this is not conditional, so 304 is unreachable — but it is
  // narrowed rather than asserted, because the day someone adds an ETag here the
  // alternative is a null stream reaching the response.
  if (found.statusCode !== 200) return null;
  return {
    stream: found.stream,
    contentType: found.blob.contentType,
    size: found.blob.size,
  };
}

/**
 * Does a private document exist? A HEAD, so it does not pull the bytes back
 * across the network just to answer a yes/no — this is called on every product
 * page render to decide whether to show the certificate link at all.
 */
export async function privateExists(pathname: string): Promise<boolean> {
  try {
    // No `access` here: head() takes no such option — it is an authenticated
    // call against the store either way, and resolves a bare pathname through
    // the read-write token. Passing access: 'private' does not typecheck.
    await head(pathname);
    return true;
  } catch {
    // head() throws BlobNotFoundError for a missing blob. Any other failure
    // (network, auth, store down) lands here too and also answers "no": the
    // caller's only use is whether to offer a download link, and offering one
    // that cannot be served is worse than omitting it.
    return false;
  }
}

/**
 * Delete a blob by the URL that was stored for it.
 *
 * Deliberately forgiving: del() on something already gone is not an error worth
 * propagating. The caller is removing a reference either way, and a blob that
 * outlives its row costs a fraction of a cent — while an exception here would
 * fail an admin save that otherwise succeeded.
 */
export async function deleteByUrl(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    /* already gone, or never existed */
  }
}
