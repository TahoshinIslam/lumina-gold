-- ============================================================================
-- 003 — campaigns
--
-- Admin had no way to bundle products into a time-boxed promotion (flash sale,
-- seasonal push) and place it on the storefront. `campaigns` is that entity;
-- `campaign_products` is the product bundle. Only one campaign may be featured
-- on the home page at a time — enforced in the admin action (unset the others
-- on write), not a DB constraint, since "at most one true" isn't expressible
-- as a simple UNIQUE key without a generated/partial-index workaround.
--
-- Status (active/expired/scheduled) is derived from start_at/end_at at read
-- time rather than stored, so it never drifts out of sync with the clock.
--
-- Apply:  mysql -u root lumina_jewelry < database/migrations/003_campaigns.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaigns (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(200) NOT NULL,
  slug              VARCHAR(220) NOT NULL UNIQUE,
  description       VARCHAR(500) NULL,
  start_at          DATETIME NOT NULL,
  end_at            DATETIME NOT NULL,
  section           ENUM('home_top','home_middle','home_bottom') NOT NULL DEFAULT 'home_middle',
  is_home_featured  TINYINT(1) NOT NULL DEFAULT 0,
  is_published      TINYINT(1) NOT NULL DEFAULT 1,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_campaigns_dates (start_at, end_at),
  KEY idx_campaigns_published (is_published)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS campaign_products (
  campaign_id INT UNSIGNED NOT NULL,
  product_id  BIGINT UNSIGNED NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  PRIMARY KEY (campaign_id, product_id),
  CONSTRAINT fk_campaign_products_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_campaign_products_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
