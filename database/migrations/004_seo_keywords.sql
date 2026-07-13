-- ============================================================================
-- 004 — seo_meta.meta_keywords
--
-- The product admin's new SEO tab needs a keywords field alongside the
-- existing meta_title/meta_description/og_image on seo_meta. Comma-separated
-- text, not a normalized table — nothing else in the app reads keywords
-- structurally (they're a relic field browsers stopped using for ranking
-- decades ago; this exists because admins still expect to see the box).
--
-- Apply:  mysql -u root lumina_jewelry < database/migrations/004_seo_keywords.sql
-- ============================================================================

ALTER TABLE seo_meta
  ADD COLUMN meta_keywords VARCHAR(255) NULL AFTER meta_description;
