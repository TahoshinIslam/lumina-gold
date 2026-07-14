/**
 * One definition of what a session cookie on this site looks like, so a new
 * cookie cannot quietly ship without a flag.
 *
 *   httpOnly  — JavaScript cannot read it, so an XSS bug cannot steal a session.
 *   secure    — never sent over plain HTTP, so it cannot be sniffed in transit.
 *               Conditional on NODE_ENV only because a `secure` cookie is
 *               DROPPED on http://localhost, which would break local dev
 *               entirely. In production it is always on.
 *   sameSite  — 'lax' is what a login cookie wants: it still rides a normal
 *               top-level link INTO the site (so arriving from an email lands
 *               you signed in), but never a cross-site POST, which is the CSRF
 *               vector. 'strict' would sign users out whenever they follow a
 *               link from anywhere else.
 *   path: '/' — the whole site.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
} as const;
