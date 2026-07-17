-- Site settings: a small key/value store for editable configuration that does
-- not warrant its own table. First use is the storefront's social media links,
-- which were hardcoded in the header (https://facebook.com and friends) and so
-- could only be changed by a developer. Now the boutique pastes its own.

CREATE TABLE IF NOT EXISTS `settings` (
  `key`        VARCHAR(64)  NOT NULL,
  `value`      TEXT         NULL,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the social keys empty, so the header simply shows no icon until a link is
-- pasted (rather than pointing at a bare https://facebook.com).
INSERT INTO `settings` (`key`, `value`) VALUES
  ('social_facebook',  ''),
  ('social_instagram', ''),
  ('social_x',         ''),
  ('social_youtube',   '')
ON DUPLICATE KEY UPDATE `key` = `key`;
