import { NextRequest, NextResponse } from 'next/server';

/**
 * proxy — runs before every page request. Two jobs:
 *
 *   1. Content-Security-Policy with a per-request nonce.
 *   2. Guard /admin/* behind the session cookie.
 *
 * The other security headers are static, so they live in next.config.ts
 * (`headers()`) where they also cover static assets. Only the CSP has to be
 * here, because a nonce must be fresh on every single request.
 */

const DEV = process.env.NODE_ENV === 'development';

/**
 * Why a nonce and not `script-src 'unsafe-inline'`.
 *
 * Next serves the RSC payload as inline <script> tags, so a CSP with no nonce
 * MUST allow inline script — and `script-src 'unsafe-inline'` permits any
 * <script> an attacker manages to inject, which is precisely the attack a CSP
 * is supposed to stop. It would let us claim a CSP without having one.
 *
 * The cost is real and worth stating: a nonce cannot be baked in at build time,
 * so every page must be rendered per-request. That is why the seven routes that
 * used to be statically prerendered now export `dynamic = 'force-dynamic'`. The
 * page cache is what we give up; the DATA cache (unstable_cache, where the
 * speed actually came from) is untouched.
 *
 * 'strict-dynamic' means the nonce propagates: a script we trust may load more
 * scripts, so we do not have to allowlist every chunk Next emits.
 *
 * style-src keeps 'unsafe-inline', and that is deliberate, not laziness. A nonce
 * does not apply to inline style ATTRIBUTES, and this codebase is built on them
 * — 88 components render style={{...}}, and the whole animation engine works by
 * writing el.style.* from JavaScript. Nonce-ing style-src would black out the
 * site. Inline style is also a far weaker primitive for an attacker than inline
 * script: it cannot execute code, and CSS-based exfiltration is already blocked
 * by img-src/connect-src 'self'.
 */
function csp(nonce: string): string {
  return [
    `default-src 'self'`,
    // 'unsafe-eval' in dev only: React uses eval to rebuild server stacks.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${DEV ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline'`,
    // blob:/data: — sharp-resized previews and the canvas dust are drawn locally.
    `img-src 'self' blob: data:`,
    `font-src 'self'`,
    // Review videos are served from /uploads on our own origin. Nowhere else.
    `media-src 'self'`,
    // ws: is the dev HMR socket; production talks to nobody but itself.
    `connect-src 'self'${DEV ? ' ws: wss:' : ''}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    // Clickjacking: nothing may frame us, and we frame nothing.
    `frame-ancestors 'none'`,
    `frame-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

const ADMIN_SECRET = process.env.AUTH_SECRET || 'lumina-dev-secret-change-me';

/**
 * Verify the admin session cookie at the edge, with WebCrypto because proxy
 * runs on the edge runtime and cannot use node:crypto or reach the database.
 *
 * The cookie is "<adminId>.<expiresUnix>.<hmacHex>" — see adminSession.ts,
 * which signs it in Node. This MUST accept exactly what that module produces;
 * a parity test (adminSession.test.ts) reimplements this with crypto.subtle and
 * asserts the two agree. Returns true iff the signature matches and the token
 * has not expired.
 */
async function validAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [idStr, expStr, sig] = parts;
  const adminId = Number(idStr);
  const expires = Number(expStr);
  if (!Number.isInteger(adminId) || adminId <= 0) return false;
  if (!Number.isInteger(expires) || expires < Math.floor(Date.now() / 1000)) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(ADMIN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${adminId}.${expires}`));
  const expected = Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time compare, so the signature cannot be recovered a byte at a time.
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function proxy(req: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const policy = csp(nonce);

  // Next reads the nonce back out of the request's CSP header and stamps it
  // onto the scripts it emits — hence setting it on the REQUEST, not just the
  // response. x-nonce is there for any <Script> we add later.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', policy);

  const { pathname } = req.nextUrl;
  const needsAdmin = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (needsAdmin) {
    const cookie = req.cookies.get('lum_admin')?.value;
    if (!(await validAdminSession(cookie))) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      const redirect = NextResponse.redirect(url);
      redirect.headers.set('Content-Security-Policy', policy);
      return redirect;
    }
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set('Content-Security-Policy', policy);
  return res;
}

export const config = {
  matcher: [
    // Everything except static assets and the image optimizer, which need no
    // CSP and would only pay the cost of running this. Prefetches are skipped
    // too — they render no HTML, so they need no nonce.
    {
      source: '/((?!_next/static|_next/image|favicon.ico|uploads).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
