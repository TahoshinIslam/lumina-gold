-- ============================================================================
-- 001 — analytics_events
--
-- The dashboard's Visitors / Product Views / Traffic Sources panels had no
-- source of truth: nothing in the schema recorded a visit. This is that source.
-- One row per page view, written by /api/track (see src/app/api/track/route.ts).
--
-- referrer_source is classified at write time (direct/organic/social/referral/
-- email) rather than stored raw, so the dashboard never has to parse URLs.
-- country is filled from the CDN geo header and stays NULL on local/XAMPP runs.
--
-- Apply:  mysql -u root lumina_jewelry < database/migrations/001_analytics_events.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id      VARCHAR(64) NOT NULL,                    -- anonymous, cookie-scoped
  user_id         BIGINT UNSIGNED NULL,                    -- NULL = guest
  event           ENUM('page_view','product_view') NOT NULL DEFAULT 'page_view',
  path            VARCHAR(255) NOT NULL,
  product_id      BIGINT UNSIGNED NULL,                    -- set for product_view
  referrer_source ENUM('direct','organic','social','referral','email') NOT NULL DEFAULT 'direct',
  referrer_host   VARCHAR(190) NULL,
  country         CHAR(2) NULL,                            -- from CDN geo header
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ae_created (created_at),
  KEY idx_ae_session (session_id),
  KEY idx_ae_event (event, created_at),
  KEY idx_ae_source (referrer_source, created_at),
  KEY idx_ae_country (country, created_at)
) ENGINE=InnoDB;
