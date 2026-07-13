-- ============================================================================
-- 002 — add_to_cart event
--
-- The conversion funnel's middle steps cannot come from the `carts` table: the
-- storefront cart lives in localStorage (see src/stores/StoreContext.tsx) and
-- nothing ever writes a cart row, so those queries would return 0 forever.
-- Tracking the add as an analytics event is what makes the funnel real.
--
-- Apply:  mysql -u root lumina_jewelry < database/migrations/002_analytics_add_to_cart.sql
-- ============================================================================

ALTER TABLE analytics_events
  MODIFY event ENUM('page_view','product_view','add_to_cart') NOT NULL DEFAULT 'page_view';
