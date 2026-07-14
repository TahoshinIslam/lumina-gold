/**
 * Browse — what most of the traffic actually is: people looking at things.
 *
 * The routes here are the ones this app HAS. It is server-rendered pages plus two
 * read APIs, not a REST backend: there is no /api/products, no /api/cart, no
 * /api/auth/login. A test written against those would score 100% failures at any
 * number of users and tell you nothing.
 *
 *   k6 run loadtest/browse.js
 *   k6 run -e BASE=https://naharjewellers.com -e PEAK=1000 loadtest/browse.js
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE = __ENV.BASE || 'http://localhost:3200';
const PEAK = Number(__ENV.PEAK || 100);

// Per-surface timings, because one blended p95 hides the fact that the home page
// is fine and the listing is not.
const home = new Trend('page_home', true);
const shop = new Trend('page_shop', true);
const product = new Trend('page_product', true);
const search = new Trend('api_search', true);

export const options = {
  stages: [
    { duration: '30s', target: Math.ceil(PEAK / 4) },  // warm
    { duration: '1m', target: PEAK },                  // ramp
    { duration: '2m', target: PEAK },                  // hold — this is the number
    { duration: '30s', target: 0 },                    // recover
  ],
  thresholds: {
    // A shop that answers in half a second under load is a shop people buy from.
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    // The listing is the heaviest read in the app (it loads the whole scoped
    // catalogue and filters in memory), so it gets its own budget.
    page_shop: ['p(95)<800'],
  },
};

// A real session looks at a few things, not one thing a thousand times.
const SLUGS = ['diamond-chain', 'bangles', 'full-bridal-set', 'diamond-ring'];
const TERMS = ['ring', 'diamond', 'gold', 'bangle', 'necklace'];
const pick = a => a[Math.floor(Math.random() * a.length)];

export default function () {
  group('home', () => {
    const res = http.get(`${BASE}/`);
    home.add(res.timings.duration);
    check(res, { 'home 200': r => r.status === 200 });
  });
  sleep(Math.random() * 2 + 1);

  group('listing', () => {
    const res = http.get(`${BASE}/shop`);
    shop.add(res.timings.duration);
    check(res, {
      'shop 200': r => r.status === 200,
      'shop has products': r => r.body.includes('lum-prod-card'),
    });
  });
  sleep(Math.random() * 2 + 1);

  group('search', () => {
    const res = http.get(`${BASE}/api/products/search?q=${pick(TERMS)}`);
    search.add(res.timings.duration);
    check(res, {
      'search 200': r => r.status === 200,
      'search returns json': r => r.json('products') !== undefined,
    });
  });
  sleep(0.5);

  group('product', () => {
    const res = http.get(`${BASE}/products/${pick(SLUGS)}`);
    product.add(res.timings.duration);
    check(res, { 'product 200': r => r.status === 200 });
  });
  sleep(Math.random() * 3 + 1);
}
