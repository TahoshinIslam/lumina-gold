/**
 * Admin auth spans two files, split by runtime:
 *
 *   this one          the cookie NAME, shared everywhere.
 *   adminSession.ts   sign/verify the cookie's VALUE in Node (node:crypto).
 *   proxy.ts          verifies the same value at the edge (WebCrypto).
 *
 * The cookie used to hold sha256("lumina-admin:" + ADMIN_PASSWORD), proven by
 * recomputing it from the env var. That is gone: admins are now rows in
 * admin_users with per-account scrypt hashes, so the cookie is a signed session
 * claim (adminSession.ts) the edge can verify without touching the database.
 * ADMIN_PASSWORD survives only to seed the first account (dal/adminUsers.ts).
 */
export const ADMIN_COOKIE = 'lum_admin';
