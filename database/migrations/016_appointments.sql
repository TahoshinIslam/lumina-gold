-- 016_appointments.sql
--
-- Appointments and bespoke commissions.
--
-- The homepage has had a "Reserve Your Appointment" button since the beginning,
-- and it was `<a href="#appointment">` — it linked to the section it was already
-- in. The most prominent call to action on the site did nothing at all. Every
-- request a customer tried to make simply evaporated.
--
-- One table serves both, because they are the same conversation with the
-- boutique: a person, a way to reach them, and what they want. `kind` separates
-- a visit from a commission.

CREATE TABLE IF NOT EXISTS `appointments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `kind` enum('appointment','bespoke') NOT NULL DEFAULT 'appointment',

  -- Who. Kept on the row rather than only as a user_id, because most people who
  -- ask for a private viewing have never made an account — and an enquiry the
  -- boutique cannot answer is worse than no enquiry.
  `name` varchar(120) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  -- Set only when the enquirer happened to be signed in.
  `user_id` bigint(20) unsigned DEFAULT NULL,

  -- Which boutique they would like to visit (warehouses of type 'store').
  `boutique_id` smallint(5) unsigned DEFAULT NULL,
  `preferred_at` datetime DEFAULT NULL,
  `message` varchar(1000) DEFAULT NULL,

  `status` enum('new','contacted','scheduled','completed','cancelled') NOT NULL DEFAULT 'new',
  `internal_note` varchar(500) DEFAULT NULL,

  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),

  PRIMARY KEY (`id`),
  -- The admin list is "everything still open, newest first".
  KEY `idx_appt_status` (`status`, `created_at`),
  KEY `idx_appt_kind` (`kind`, `created_at`),
  KEY `fk_appt_user` (`user_id`),
  KEY `fk_appt_boutique` (`boutique_id`),
  CONSTRAINT `fk_appt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_appt_boutique` FOREIGN KEY (`boutique_id`) REFERENCES `warehouses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The two analytics events these unlock. They could not be tracked before
-- because there was nothing to track.
ALTER TABLE `analytics_events`
  MODIFY COLUMN `event` enum(
    'page_view','product_view','add_to_cart',
    'search','select_item','remove_from_cart','view_cart',
    'begin_checkout','add_shipping_info','add_payment_info',
    'purchase','refund','web_vital',
    'book_appointment','submit_bespoke_request'
  ) NOT NULL DEFAULT 'page_view';
