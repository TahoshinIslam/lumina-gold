import type { PoolConnection } from 'mysql2/promise';
import { cookies } from 'next/headers';

/**
 * Commerce analytics — the events that carry money.
 *
 * WHY THESE ARE SERVER-SIDE, and the client ones are not:
 *
 * A purchase event fired from the browser is recorded on the success page, which
 * means it is recorded again every time the customer refreshes it, presses back,
 * or shares the link. That is the single most common way an analytics revenue
 * figure ends up higher than the bank's. It also means the VALUE is a number the
 * browser chose, which is the same class of mistake as trusting a browser's
 * price.
 *
 * So `purchase` is written HERE, inside the order's own transaction, from the
 * server-computed grand_total. The event therefore exists if and only if the
 * order does — one order, one purchase event, the right amount, and no way for a
 * refresh to add another. The database enforces the rest: UNIQUE(order_id, event)
 * makes a second purchase row for the same order impossible even in principle.
 *
 * /api/track REFUSES a purchase or refund event from a client for the same
 * reason. Revenue is not something the browser gets an opinion about.
 */

/** The anonymous session cookie the page beacon already uses, so a purchase
 *  stitches onto the same funnel as the views that led to it. No user id. */
const SESSION_COOKIE = 'lum_sid';

async function sessionId(): Promise<string> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? 'server';
}

/**
 * Record the sale. Runs INSIDE the caller's order transaction: if the order
 * rolls back (it sold out, the coupon was exhausted), the purchase event rolls
 * back with it and no revenue is ever claimed for an order that does not exist.
 *
 * A TEST order records nothing — it is not a sale.
 */
export async function recordPurchase(
  conn: PoolConnection,
  purchase: { orderId: number; value: number; currency: string; isTest?: boolean; path?: string },
): Promise<void> {
  if (purchase.isTest) return;

  await conn.query(
    `INSERT INTO analytics_events (session_id, event, path, order_id, value, currency)
     VALUES (?, 'purchase', ?, ?, ?, ?)
     -- Belt and braces on top of UNIQUE(order_id, event): a duplicate must never
     -- take the ORDER down with it, so it is a no-op rather than an error.
     ON DUPLICATE KEY UPDATE id = id`,
    [await sessionId(), purchase.path ?? '/checkout', purchase.orderId, purchase.value, purchase.currency],
  );
}

/**
 * An appointment request or a bespoke commission.
 *
 * Written in the same transaction as the enquiry row, for the same reason
 * purchase is: an event should mean a request that actually exists. If the
 * insert rolls back, no event is booked — and a failed submission cannot inflate
 * the count of people asking to visit the boutique.
 *
 * `label` carries the enquiry id, so a row in the funnel can be traced back to
 * the request it represents. It carries nothing about the person — their name
 * and number live in `appointments`, where the boutique needs them, and nowhere
 * near analytics.
 */
export async function recordEnquiry(
  conn: PoolConnection,
  enquiry: { event: 'book_appointment' | 'submit_bespoke_request'; enquiryId: number },
): Promise<void> {
  await conn.query(
    `INSERT INTO analytics_events (session_id, event, path, label)
     VALUES (?, ?, '/#appointment', ?)`,
    [await sessionId(), enquiry.event, `enquiry:${enquiry.enquiryId}`],
  );
}

/**
 * Record a refund — the amount given back, as a positive number. The dashboard
 * subtracts it; storing it negative would make every naive SUM() silently wrong
 * in the other direction.
 */
export async function recordRefund(
  conn: PoolConnection,
  refund: { orderId: number; value: number; currency: string },
): Promise<void> {
  await conn.query(
    `INSERT INTO analytics_events (session_id, event, path, order_id, value, currency)
     VALUES ('server', 'refund', '/admin/orders', ?, ?, ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [refund.orderId, refund.value, refund.currency],
  );
}
