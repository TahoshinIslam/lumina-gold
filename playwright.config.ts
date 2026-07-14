import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end config. These tests hit a REAL running server, so they are kept
 * out of the `check` gate (lint · typecheck · unit · build) — that gate must be
 * fast and hermetic. e2e is a separate, heavier stage.
 *
 * `webServer` builds and starts the PRODUCTION server (not `next dev`) so the
 * tests exercise what actually ships. It needs the same secrets production does
 * (AUTH_SECRET, ADMIN_PASSWORD) — the app refuses to boot without them.
 *
 * Browsers are NOT bundled by `npm ci`; run `npx playwright install` once before
 * the first `npm run test:e2e`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Start the app for the tests unless one is already running (E2E_BASE_URL set).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        timeout: 180_000,
        reuseExistingServer: !process.env.CI,
      },
});
