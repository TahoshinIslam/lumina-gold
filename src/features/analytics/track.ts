/**
 * Client-side analytics events.
 *
 * ONE RULE, and the whole module exists to enforce it: **analytics must never
 * break, block, or slow the thing the customer is actually doing.** Every call
 * here is fire-and-forget — the promise is dropped, the error is swallowed, and
 * nothing awaits it. A shopper must be able to check out with the analytics
 * endpoint returning 500 on every request and never know.
 *
 * `keepalive` so an event fired during a navigation (begin_checkout, then the
 * page changes) still gets out rather than being cancelled with the old page.
 *
 * Note what is NOT here: purchase and refund. Those carry money and are written
 * server-side inside the order's transaction (@/server/analytics) — a purchase
 * fired from the browser is fired again on every refresh of the success page,
 * and /api/track refuses one from a client outright.
 */

/** The events a browser is allowed to report. */
export type ClientEvent =
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'search'
  | 'select_item'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'
  | 'web_vital';

export function track(event: ClientEvent, opts: { label?: string; value?: number } = {}): void {
  if (typeof window === 'undefined') return;

  // No await, no return value — the caller carries on regardless.
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      path: window.location.pathname,
      // A search TERM is a person's words. It is kept because it is the point of
      // the event, but it is truncated and never joined to a user id — the
      // session id is a random uuid and analytics_events.user_id is never written.
      ...(opts.label ? { label: opts.label.slice(0, 120) } : {}),
      ...(opts.value != null ? { value: opts.value } : {}),
    }),
    keepalive: true,
  }).catch(() => { /* analytics never breaks the page */ });
}
