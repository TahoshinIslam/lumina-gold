/**
 * Authenticated load — session verification and per-customer database reads.
 *
 * This is the closest robust proxy for "checkout under load" that this app
 * offers over plain HTTP. The checkout page itself is a client shell that pulls
 * its state through a server ACTION, and a server action is not a REST call: the
 * browser invokes it by POSTing React Flight-encoded arguments, an internal
 * contract that changes per build and rots the moment it is hand-forged. And
 * placeOrderAction writes a real order and decrements live stock, so it must
 * never be flooded at all.
 *
 * The account pages, by contrast, ARE server-rendered, and they exercise the
 * same machinery checkout leans on: the signed session cookie is verified on
 * every request, and /account runs five per-customer queries (the customer, their
 * orders, addresses, reviews and rewards). If authentication and customer-scoped
 * reads hold up here, they hold up at the till.
 *
 *   USER_COOKIE=$(node loadtest/session.mjs 47) k6 run loadtest/account.js
 *   USER_COOKIE=$(node loadtest/session.mjs 47) k6 run -e PEAK=500 loadtest/account.js
 *
 * USER_COOKIE is a real lum_customer value; mint it with loadtest/session.mjs so
 * this never needs AUTH_SECRET. Use a demo account, never a real customer.
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE = __ENV.BASE || 'http://localhost:3200';
const PEAK = Number(__ENV.PEAK || 100);
const COOKIE = __ENV.USER_COOKIE;

const account = new Trend('page_account', true);
const orders = new Trend('page_orders', true);

export const options = {
  stages: [
    { duration: '30s', target: Math.ceil(PEAK / 4) },
    { duration: '1m', target: PEAK },
    { duration: '2m', target: PEAK },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
    // The dashboard fans out to five queries; give it room but still bound it.
    page_account: ['p(95)<1000'],
  },
};

export function setup() {
  if (!COOKIE) {
    throw new Error('USER_COOKIE is required — `node loadtest/session.mjs <demoUserId>`');
  }
  // Fail fast and loudly if the cookie is not actually accepted, rather than
  // "passing" by measuring the signed-out version of every page.
  const res = http.get(`${BASE}/account`, { headers: { Cookie: `lum_customer=${COOKIE}` } });
  if (!res.body.includes('Welcome')) {
    throw new Error('USER_COOKIE was not accepted — is AUTH_SECRET the same as the server\'s?');
  }
}

const authGet = path => http.get(`${BASE}${path}`, { headers: { Cookie: `lum_customer=${COOKIE}` } });

export default function () {
  group('account dashboard', () => {
    const res = authGet('/account');
    account.add(res.timings.duration);
    check(res, {
      'account 200': r => r.status === 200,
      'session accepted': r => r.body.includes('Welcome'),  // not the signed-out page
    });
  });
  sleep(Math.random() * 2 + 1);

  group('my orders', () => {
    const res = authGet('/account/orders');
    orders.add(res.timings.duration);
    check(res, { 'orders 200': r => r.status === 200 });
  });
  sleep(Math.random() * 3 + 2);
}
