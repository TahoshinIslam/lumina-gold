/**
 * Mint a valid lum_customer cookie for a demo account, so the checkout load test
 * can log in without knowing AUTH_SECRET on the command line.
 *
 * The session is `userId.hmac_sha256(AUTH_SECRET, userId)` — see
 * src/server/auth/customer.ts. This reproduces exactly that.
 *
 *   node loadtest/session.mjs 21
 *   USER_COOKIE=$(node loadtest/session.mjs 21) k6 run loadtest/checkout.js
 *
 * Use a @demo.lumina account (see database/seed-demo.ts), never a real customer.
 */
import { createHmac } from 'node:crypto';

const userId = process.argv[2];
if (!userId) {
  console.error('usage: node loadtest/session.mjs <userId>');
  process.exit(1);
}

const secret = process.env.AUTH_SECRET || 'lumina-dev-secret-change-me';
const sig = createHmac('sha256', secret).update(String(userId)).digest('hex');
process.stdout.write(`${userId}.${sig}`);
