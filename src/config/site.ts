/**
 * The site's public base URL.
 *
 * Used to build absolute links that leave the app — the QR tracking URL on a
 * printed invoice, and anything similar later (emails, canonical tags). It reads
 * `SITE_URL` and falls back to the production domain, so behaviour is unchanged
 * if the variable is unset.
 *
 * The point of making it configurable: an invoice printed from a STAGING deploy
 * should link back to staging, not silently send a courier scanning the QR to
 * the live site. Set SITE_URL per environment.
 *
 * Deliberately NOT `NEXT_PUBLIC_` — every current use is server-side (invoice
 * generation, PDFs), so there is no reason to ship the value in the client
 * bundle. Add a NEXT_PUBLIC_ mirror only if the browser ever needs it.
 */
export const SITE_URL = (process.env.SITE_URL || 'https://naharjewellers.com').replace(/\/+$/, '');

/** Join a path onto the site URL, guaranteeing exactly one slash. */
export function siteUrl(path = ''): string {
  return path ? `${SITE_URL}/${path.replace(/^\/+/, '')}` : SITE_URL;
}
