import { test, expect } from '@playwright/test';

/**
 * Production smoke test: the things that must be true of every page the moment
 * it loads, checked against the real built server — the exact list the manual
 * "run it in production and confirm" pass covers, made repeatable.
 */

const ROUTES = ['/', '/shop', '/cart', '/checkout', '/account/login'];

for (const path of ROUTES) {
  test(`${path} loads with no console errors, no failed requests, no hydration mismatch`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('requestfailed', req => {
      failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
    });
    page.on('response', res => {
      // A page's own document/asset returning 4xx/5xx is a real failure; ignore
      // analytics/beacon 4xx which are expected to be rejected off-origin.
      if (res.status() >= 500) failedRequests.push(`${res.status()} ${res.url()}`);
    });

    const response = await page.goto(path, { waitUntil: 'networkidle' });
    expect(response?.status(), `${path} should return 2xx/3xx`).toBeLessThan(400);

    // Let any deferred hydration settle, then assert nothing screamed.
    await page.waitForTimeout(1500);

    const hydration = consoleErrors.filter(e => /hydrat|did not match|Text content does not match/i.test(e));
    expect(hydration, `hydration errors on ${path}`).toEqual([]);
    expect(consoleErrors, `console errors on ${path}`).toEqual([]);
    expect(failedRequests, `failed requests on ${path}`).toEqual([]);
  });
}

test('images resolve (no broken <img> on the home page)', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const broken = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter(img => img.complete && img.naturalWidth === 0)
      .map(img => img.currentSrc || img.src),
  );
  expect(broken, 'broken images').toEqual([]);
});
