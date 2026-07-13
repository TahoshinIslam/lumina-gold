-- Home page imagery, managed from Admin → Home Models.
--
-- The landing page's three editorial sections (Collections, Savoir-Faire,
-- Heritage) shipped with hardcoded /uploads/home/*.png files, so changing a
-- model shot meant a code deploy. Each section is now a gallery: upload one
-- image and it sits still, upload several and they cross-fade.
--
-- Deliberately NOT tied to products — these are brand/model photographs, and
-- forcing them through the catalogue would mean inventing fake SKUs for them.

CREATE TABLE IF NOT EXISTS home_media (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  section     VARCHAR(32)  NOT NULL COMMENT 'collections | craft | heritage',
  image       VARCHAR(255) NOT NULL,
  alt         VARCHAR(160) DEFAULT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_home_media_section (section, sort_order, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
