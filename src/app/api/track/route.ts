import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query } from '@/server/db/client';

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

export async function POST(req: NextRequest) {
  let body: { path?: unknown; referrer?: unknown; event?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = typeof body.path === 'string' ? body.path.slice(0, 255) : '';
  if (!path.startsWith('/') || path.startsWith('/admin') || path.startsWith('/api')) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Only add_to_cart is caller-declared; view events are derived from the path
  // below, so a client cannot inflate product views by claiming an event type.
  const isAddToCart = body.event === 'add_to_cart';

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

  const event = isAddToCart ? 'add_to_cart' : productId ? 'product_view' : 'page_view';

  await query(
    `INSERT INTO analytics_events
       (session_id, event, path, product_id, referrer_source, referrer_host, country)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [sessionId, event, path, productId, source, refHost, country?.slice(0, 2) ?? null],
  );

  const res = NextResponse.json({ ok: true });
  if (isNewSession) {
    res.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true, sameSite: 'lax', path: '/', maxAge: SESSION_MAX_AGE,
    });
  }
  return res;
}
