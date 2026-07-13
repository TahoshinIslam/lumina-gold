-- Phases 8–11: customer profile, reviews, admin fulfilment.

/* ── Profile (Phase 8) ────────────────────────────────────────────────── */

ALTER TABLE users
  ADD COLUMN avatar_path VARCHAR(255) NULL AFTER phone,
  -- Notification preferences. Opt-IN by default is only honest for the ones a
  -- customer would expect (their own order), never for marketing.
  ADD COLUMN notify_order  TINYINT(1) NOT NULL DEFAULT 1 AFTER is_active,
  ADD COLUMN notify_offers TINYINT(1) NOT NULL DEFAULT 0 AFTER notify_order,
  ADD COLUMN notify_sms    TINYINT(1) NOT NULL DEFAULT 1 AFTER notify_offers;

/* ── Reviews (Phases 9 & 11) ──────────────────────────────────────────── */

ALTER TABLE reviews
  -- The boutique's public answer to a review, and who hid it if it was hidden.
  ADD COLUMN reply         TEXT NULL AFTER body,
  ADD COLUMN replied_at    DATETIME NULL AFTER reply,
  ADD COLUMN helpful_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER replied_at,
  ADD COLUMN updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- A review can carry photos and video of the piece as worn.
CREATE TABLE IF NOT EXISTS review_media (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  review_id  BIGINT UNSIGNED NOT NULL,
  path       VARCHAR(255) NOT NULL,
  kind       ENUM('image','video') NOT NULL DEFAULT 'image',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_review_media (review_id, sort_order),
  CONSTRAINT fk_review_media_review FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- "Helpful" has to be idempotent: one vote per person, or the count is fiction.
CREATE TABLE IF NOT EXISTS review_helpful (
  review_id  BIGINT UNSIGNED NOT NULL,
  user_id    BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (review_id, user_id),
  CONSTRAINT fk_helpful_review FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE,
  CONSTRAINT fk_helpful_user   FOREIGN KEY (user_id)   REFERENCES users (id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One review per customer per piece — the UNIQUE key is what makes "edit your
-- review" the only way to say something twice.
ALTER TABLE reviews
  ADD UNIQUE KEY uniq_review_user_product (product_id, user_id);

/* ── Fulfilment (Phase 10) ────────────────────────────────────────────── */

ALTER TABLE orders
  -- Notes the customer never sees; kept apart from customer_note on purpose.
  ADD COLUMN internal_note VARCHAR(1000) NULL AFTER gift_message;
