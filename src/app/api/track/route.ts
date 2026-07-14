import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query } from '@/server/db/client';
import { SESSION_COOKIE_OPTIONS } from '@/server/auth/cookieOptions';
import { isSameOrigin } from '@/server/security/origin';
import { hit, clientKey } from '@/server/security/rateLimit';

/**
 * Storefront analytics sink. One row per view — this is what the dashboard's
 * Visitors / Product Views / Traffic Sources panels read.
 *
 * Anonymous by design: the session cookie is a random id with no PII, and it is
 * the only thing tying two views together. Admin routes are never tracked.
 */

const SESSION_COOKIE = 'lum_sid';
const SESSION_MAX_AGE = 60 * 60 * 24 * 365;

const SOCIAL = /(facebook|instagram|twitter|x\.com|linkedin|pinterest|tiktok|youtube|reddit)\./i;
const SEARCH = /(google|bing|yahoo|duckduckgo|baidu|yandex|ecosia)\./i;
const EMAIL = /(mail\.|outlook\.|gmail|mailchimp|sendgrid)/i;

/** Raw referrer → the five buckets the Traffic Sources panel charts. */
function classify(referrer: string | null, host: string) {
  if (!referrer) return { source: 'direct' as const, refHost: null };
  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return { source: 'direct' as const, refHost: null };
  }
  // Same-origin navigation is not a new traffic source.
  if (url.host === host) return { source: 'direct' as const, refHost: null };

  const h = url.host;
  const source = EMAIL.test(h) ? 'email'
    : SEARCH.test(h) ? 'organic'
    : SOCIAL.test(h) ? 'social'
    : 'referral';
  return { source, refHost: h.slice(0, 190) };
}

/**
 * Strip identifiers out of a path before it is stored.
 *
 * `/account/orders/LUM-2026-123456` and `/checkout/success/LUM-2026-123456` were
 * being written to analytics verbatim. An order number is not a name, but it
 * points at exactly one person's purchase, and the funnel does not need it — the
 * useful fact is "someone looked at an order page", not which order. So the id
 * is collapsed and the shape of the page is kept.
 */
export function redactPath(path: string): string {
  return path
    .replace(/\/(account\/orders|checkout\/success)\/[^/?#]+/, '/$1/:orderNo')
    // Any other trailing all-caps/number id (an order no. is LUM-YYYY-NNNNNN).
    .replace(/\/LUM-\d{4}-\d+/gi, '/:orderNo');
}

export async function POST(req: NextRequest) {
  // Unauthenticated by design — it counts page views — but it also INSERTs on
  // every call, so left open it is a free way to flood the analytics tables.
  // Same-origin only, and capped.
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const gate = hit(await clientKey('track'), 120, 60);
  if (!gate.ok) {
    return NextResponse.json(
      { ok: false },
      { status: 429, headers: { 'Retry-After': String(gate.retryAfterSec) } },
    );
  }

  let body: { path?: unknown; referrer?: unknown; event?: unknown; label?: unknown; value?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const rawPath = typeof body.path === 'string' ? body.path.slice(0, 255) : '';
  if (!rawPath.startsWith('/') || rawPath.startsWith('/admin') || rawPath.startsWith('/api')) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // An order number in the path is an identifier for a person's purchase, and
  // analytics has no need of it — /account/orders/LUM-2026-123456 was being
  // stored verbatim. Collapse it to the shape of the page.
  const path = redactPath(rawPath);

  // ── What the client is ALLOWED to claim ───────────────────────────────────
  // purchase and refund are NOT on this list, and that is the point: they carry
  // money. A purchase fired from the browser is re-fired on every refresh of the
  // success page, and its value would be a number the browser chose. Both are
  // written server-side instead, inside the order's own transaction
  // (@/server/analytics). A client asking for one is refused outright.
  const claimed = typeof body.event === 'string' ? body.event : null;
  if (claimed === 'purchase' || claimed === 'refund') {
    return NextResponse.json({ ok: false, error: 'server-only event' }, { status: 403 });
  }
  const CLIENT_EVENTS = [
    'add_to_cart', 'remove_from_cart', 'view_cart', 'search', 'select_item',
    'begin_checkout', 'add_shipping_info', 'add_payment_info', 'web_vital',
  ] as const;
  const declared = CLIENT_EVENTS.includes(claimed as (typeof CLIENT_EVENTS)[number])
    ? (claimed as (typeof CLIENT_EVENTS)[number])
    : null;

  const referrer = typeof body.referrer === 'string' && body.referrer ? body.referrer : null;
  const { source, refHost } = classify(referrer, req.headers.get('host') ?? '');

  // Geo comes from the CDN; on a local/XAMPP run there is no such header and the
  // column stays NULL — the dashboard falls back to shipping country in that case.
  const country =
    req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry') ?? null;

  let sessionId = req.cookies.get(SESSION_COOKIE)?.value;
  const isNewSession = !sessionId;
  if (!sessionId) sessionId = randomUUID();

  // A product page is the funnel's first step, so resolve the slug to an id.
  const slug = path.startsWith('/products/') ? path.slice('/products/'.length).split('?')[0] : null;
  let productId: number | null = null;
  if (slug) {
    const [row] = await query<{ id: number }>('SELECT id FROM products WHERE slug = ? LIMIT 1', [slug]);
    productId = row?.id ?? null;
  }

  // A declared event wins; otherwise the view type is DERIVED from the path, so
  // a client still cannot inflate product views by claiming to be on one.
  const event = declared ?? (productId ? 'product_view' : 'page_view');

  // `label` carries the search term / web-vital name / payment method. `value`
  // is only ever a web-vital measurement here — money never comes from a client.
  const label = typeof body.label === 'string' ? body.label.slice(0, 120) : null;
  const value = event === 'web_vital' && typeof body.value === 'number' && Number.isFinite(body.value)
    ? Math.round(body.value * 100) / 100
    : null;

  await query(
    `INSERT INTO analytics_events
       (session_id, event, path, product_id, referrer_source, referrer_host, country, label, value)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [sessionId, event, path, productId, source, refHost, country?.slice(0, 2) ?? null, label, value],
  );

  const res = NextResponse.json({ ok: true });
  if (isNewSession) {
    res.cookies.set(SESSION_COOKIE, sessionId, {
      ...SESSION_COOKIE_OPTIONS, maxAge: SESSION_MAX_AGE,
    });
  }
  return res;
}
