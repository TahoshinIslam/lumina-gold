-- 015_analytics_commerce.sql
--
-- Commerce analytics, first-party.
--
-- `analytics_events` could record three things: page_view, product_view,
-- add_to_cart. There was no purchase event at all — the funnel simply stopped at
-- "added to bag" and the dashboard's revenue came straight from the orders table
-- instead. That is why revenue was never wrong; it is also why nobody could ask
-- "how many people who began checkout finished it?".
--
-- This migration adds the rest of the funnel, and the two columns that make a
-- purchase event trustworthy: what it was worth, and which order it was.

-- ── The event vocabulary ─────────────────────────────────────────────────────
ALTER TABLE `analytics_events`
  MODIFY COLUMN `event` enum(
    'page_view','product_view','add_to_cart',
    'search','select_item','remove_from_cart','view_cart',
    'begin_checkout','add_shipping_info','add_payment_info',
    'purchase','refund','web_vital'
  ) NOT NULL DEFAULT 'page_view';

-- ── What an event was worth ──────────────────────────────────────────────────
-- Only purchase/refund carry money; web_vital carries a millisecond figure. One
-- nullable numeric column serves all three rather than three sparse ones.
ALTER TABLE `analytics_events`
  ADD COLUMN `value` decimal(12,2) DEFAULT NULL AFTER `product_id`,
  ADD COLUMN `currency` char(3) DEFAULT NULL AFTER `value`,
  ADD COLUMN `order_id` bigint(20) unsigned DEFAULT NULL AFTER `currency`,
  -- Free-form detail: the search term, the web-vital name (LCP/CLS/INP), the
  -- payment method. Deliberately NOT a place for anything about a person.
  ADD COLUMN `label` varchar(120) DEFAULT NULL AFTER `order_id`;

-- THE guarantee: a purchase can be recorded ONCE per order, enforced by the
-- database rather than by hoping the client doesn't refresh the success page.
-- A browser-fired purchase event double-counts on every reload; this makes that
-- impossible even if the event were fired a hundred times. Same for refund.
--
-- NULL order_id repeats freely (MySQL treats NULLs as distinct in a UNIQUE), so
-- page_view/search/etc. are unaffected — the constraint only bites on the two
-- events that actually carry money.
ALTER TABLE `analytics_events`
  ADD UNIQUE KEY `uq_ae_order_event` (`order_id`, `event`);

ALTER TABLE `analytics_events`
  ADD CONSTRAINT `fk_ae_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

-- ── Test orders ──────────────────────────────────────────────────────────────
-- A test order placed against production counted as real revenue, because there
-- was no way to say "this one isn't real". Flagged orders are excluded from the
-- revenue figures AND never emit a purchase event.
ALTER TABLE `orders`
  ADD COLUMN `is_test` tinyint(1) NOT NULL DEFAULT 0 AFTER `status`;

ALTER TABLE `orders`
  ADD KEY `idx_orders_is_test` (`is_test`, `placed_at`);
