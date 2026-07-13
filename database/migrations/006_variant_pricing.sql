-- ============================================================================
-- 006 — variant pricing (compare-at / cost price)
--
-- Add Product now builds real per-combination variants (e.g. Metal Purity ×
-- Ring Size), each with its own selling price, stock, SKU, weight — all of
-- which already existed on product_variants/variant_price_components/
-- inventory. The two fields that didn't exist yet: a "compare at" (strike-
-- through) price and an internal cost price, both per variant.
--
-- Apply:  mysql -u root lumina_jewelry < database/migrations/006_variant_pricing.sql
-- ============================================================================

ALTER TABLE variant_price_components
  ADD COLUMN compare_price DECIMAL(12,2) NULL AFTER fixed_price,
  ADD COLUMN cost_price    DECIMAL(12,2) NULL AFTER compare_price;
