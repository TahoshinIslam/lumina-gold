-- ============================================================================
-- LUMINA / Nahar Jewellers — full MariaDB schema (MariaDB 10.4, XAMPP)
--
-- GENERATED from the live database — do not hand-edit. Regenerate with:
--
--   mysqldump -u root --no-data --skip-comments lumina_jewelry
--   mysqldump -u root --no-create-info --skip-comments --complete-insert \
--             --skip-extended-insert lumina_jewelry <lookup tables>
--
-- What it contains: every table's structure, plus the REFERENCE data the app
-- cannot boot without (metals, purities, colours, stone shapes/grades, gold
-- rates, categories, collections, occasions, styles, genders, tags, warehouse,
-- roles/permissions, the nav menus). It contains NO business data — no
-- products, customers, orders or reviews.
--
-- Fresh install:
--   mysql -u root < database/schema.sql
--   npx tsx database/seed-demo.ts        # optional: demo customers + orders
--
-- Existing database: apply database/migrations/*.sql in numeric order instead.
-- This file is where they all land; the migrations are the upgrade path for a
-- database that already has data in it.
--
-- This file used to be maintained by hand and had drifted five tables and
-- several columns behind the migrations, so a fresh install from it produced a
-- database the app could not run against.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS lumina_jewelry
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lumina_jewelry;

SET NAMES utf8mb4;
-- Tables and reference rows are emitted alphabetically, which is not foreign-key
-- order (attribute_values before attributes, role_permissions before roles).
SET FOREIGN_KEY_CHECKS = 0;

-- ── Structure ───────────────────────────────────────────────────────────────

CREATE TABLE `addresses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `label` varchar(40) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `line1` varchar(255) NOT NULL,
  `line2` varchar(255) DEFAULT NULL,
  `city` varchar(80) NOT NULL,
  `district` varchar(80) DEFAULT NULL,
  `postcode` varchar(20) DEFAULT NULL,
  `country` char(2) NOT NULL DEFAULT 'BD',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_addr_user` (`user_id`),
  CONSTRAINT `fk_addr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `admin_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` smallint(5) unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_au_role` (`role_id`),
  CONSTRAINT `fk_au_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `analytics_events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(64) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `event` enum('page_view','product_view','add_to_cart','search','select_item','remove_from_cart','view_cart','begin_checkout','add_shipping_info','add_payment_info','purchase','refund','web_vital','book_appointment','submit_bespoke_request') NOT NULL DEFAULT 'page_view',
  `path` varchar(255) NOT NULL,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `value` decimal(12,2) DEFAULT NULL,
  `currency` char(3) DEFAULT NULL,
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `label` varchar(120) DEFAULT NULL,
  `referrer_source` enum('direct','organic','social','referral','email') NOT NULL DEFAULT 'direct',
  `referrer_host` varchar(190) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ae_order_event` (`order_id`,`event`),
  KEY `idx_ae_created` (`created_at`),
  KEY `idx_ae_session` (`session_id`),
  KEY `idx_ae_event` (`event`,`created_at`),
  KEY `idx_ae_source` (`referrer_source`,`created_at`),
  KEY `idx_ae_country` (`country`,`created_at`),
  CONSTRAINT `fk_ae_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `attribute_values` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `attribute_id` smallint(5) unsigned NOT NULL,
  `value` varchar(120) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attr_value` (`attribute_id`,`value`),
  CONSTRAINT `fk_av_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `attributes` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `code` varchar(80) NOT NULL,
  `input_type` enum('select','text','number') NOT NULL DEFAULT 'select',
  `is_variant_level` tinyint(1) NOT NULL DEFAULT 1,
  `is_filterable` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `admin_user_id` int(10) unsigned DEFAULT NULL,
  `action` varchar(60) NOT NULL,
  `entity_type` varchar(60) NOT NULL,
  `entity_id` bigint(20) unsigned DEFAULT NULL,
  `old_values` text DEFAULT NULL,
  `new_values` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_al_entity` (`entity_type`,`entity_id`),
  KEY `idx_al_admin` (`admin_user_id`,`created_at`),
  CONSTRAINT `fk_al_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `banners` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `position` varchar(60) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `subtitle` varchar(300) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `blog_comments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `blog_id` int(10) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `body` varchar(2000) NOT NULL,
  `status` enum('visible','hidden') NOT NULL DEFAULT 'visible',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_blog_comments` (`blog_id`,`status`,`created_at`),
  KEY `fk_comment_user` (`user_id`),
  CONSTRAINT `fk_comment_blog` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `blogs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `excerpt` varchar(500) DEFAULT NULL,
  `read_minutes` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `tag` varchar(40) DEFAULT NULL,
  `body` mediumtext DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `author_id` int(10) unsigned DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `brands` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `campaign_products` (
  `campaign_id` int(10) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`campaign_id`,`product_id`),
  KEY `fk_campaign_products_product` (`product_id`),
  CONSTRAINT `fk_campaign_products_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_campaign_products_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `campaigns` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `section` enum('home_top','home_middle','home_bottom') NOT NULL DEFAULT 'home_middle',
  `is_home_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_campaigns_dates` (`start_at`,`end_at`),
  KEY `idx_campaigns_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `cart_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint(20) unsigned NOT NULL,
  `variant_id` bigint(20) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL,
  `engraving` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cart_variant` (`cart_id`,`variant_id`),
  KEY `fk_ci_variant` (`variant_id`),
  CONSTRAINT `fk_ci_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ci_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `carts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `status` enum('active','converted','abandoned') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_cart_user` (`user_id`),
  KEY `idx_cart_session` (`session_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_cat_parent` (`parent_id`),
  CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `certificates` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint(20) unsigned NOT NULL,
  `certificate_no` varchar(80) NOT NULL,
  `issuer` enum('GIA','IGI','HRD','SGL','AGS','Other') NOT NULL DEFAULT 'Other',
  `pdf_path` varchar(255) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `issued_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cert_no` (`issuer`,`certificate_no`),
  KEY `fk_cert_variant` (`variant_id`),
  CONSTRAINT `fk_cert_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `collections` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `starts_at` date DEFAULT NULL,
  `ends_at` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `coupons` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(40) NOT NULL,
  `type` enum('percent','fixed') NOT NULL,
  `value` decimal(12,2) NOT NULL,
  `min_order` decimal(12,2) NOT NULL DEFAULT 0.00,
  `max_discount` decimal(12,2) DEFAULT NULL,
  `usage_limit` int(10) unsigned DEFAULT NULL,
  `used_count` int(10) unsigned NOT NULL DEFAULT 0,
  `per_user_limit` int(10) unsigned DEFAULT NULL,
  `starts_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `faqs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `question` varchar(300) NOT NULL,
  `answer` text NOT NULL,
  `category` varchar(80) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `genders` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `home_media` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `section` varchar(32) NOT NULL COMMENT 'collections | craft | heritage',
  `image` varchar(255) NOT NULL,
  `image_phone` varchar(255) DEFAULT NULL,
  `width` smallint(5) unsigned DEFAULT NULL,
  `height` smallint(5) unsigned DEFAULT NULL,
  `alt` varchar(160) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_home_media_section` (`section`,`sort_order`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `inventory` (
  `variant_id` bigint(20) unsigned NOT NULL,
  `warehouse_id` smallint(5) unsigned NOT NULL,
  `quantity_available` int(11) NOT NULL DEFAULT 0,
  `quantity_reserved` int(11) NOT NULL DEFAULT 0,
  `reorder_level` int(11) NOT NULL DEFAULT 0,
  `availability` enum('in_stock','made_to_order','ready_to_ship','out_of_stock') NOT NULL DEFAULT 'in_stock',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`variant_id`,`warehouse_id`),
  KEY `fk_inv_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_inv_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inv_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `inventory_movements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint(20) unsigned NOT NULL,
  `warehouse_id` smallint(5) unsigned NOT NULL,
  `movement_type` enum('purchase','sale','return','damage','transfer_in','transfer_out','reservation','release','adjustment','production') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reference_type` varchar(40) DEFAULT NULL,
  `reference_id` bigint(20) unsigned DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_im_warehouse` (`warehouse_id`),
  KEY `idx_im_variant` (`variant_id`,`created_at`),
  KEY `idx_im_ref` (`reference_type`,`reference_id`),
  CONSTRAINT `fk_im_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_im_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `inventory_reservations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint(20) unsigned NOT NULL,
  `warehouse_id` smallint(5) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL,
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `cart_id` bigint(20) unsigned DEFAULT NULL,
  `status` enum('active','fulfilled','released','expired') NOT NULL DEFAULT 'active',
  `expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_ir_variant` (`variant_id`),
  KEY `fk_ir_warehouse` (`warehouse_id`),
  KEY `idx_ir_status` (`status`,`expires_at`),
  CONSTRAINT `fk_ir_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ir_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `product_serials` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint(20) unsigned NOT NULL,
  `serial_number` varchar(80) NOT NULL,
  `status` enum('in_stock','reserved','sold','returned','damaged') NOT NULL DEFAULT 'in_stock',
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_serial` (`serial_number`),
  KEY `idx_serial_variant_status` (`variant_id`,`status`),
  KEY `fk_serial_order` (`order_id`),
  CONSTRAINT `fk_serial_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_serial_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `appointments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `kind` enum('appointment','bespoke') NOT NULL DEFAULT 'appointment',
  `name` varchar(120) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `boutique_id` smallint(5) unsigned DEFAULT NULL,
  `preferred_at` datetime DEFAULT NULL,
  `message` varchar(1000) DEFAULT NULL,
  `status` enum('new','contacted','scheduled','completed','cancelled') NOT NULL DEFAULT 'new',
  `internal_note` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_appt_status` (`status`,`created_at`),
  KEY `idx_appt_kind` (`kind`,`created_at`),
  KEY `fk_appt_user` (`user_id`),
  KEY `fk_appt_boutique` (`boutique_id`),
  CONSTRAINT `fk_appt_boutique` FOREIGN KEY (`boutique_id`) REFERENCES `warehouses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_appt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `menu_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `menu_id` smallint(5) unsigned NOT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `label` varchar(120) NOT NULL,
  `url` varchar(500) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `fk_mi_parent` (`parent_id`),
  KEY `idx_mi_menu` (`menu_id`,`parent_id`,`sort_order`),
  CONSTRAINT `fk_mi_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mi_parent` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `menus` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `code` varchar(80) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `metal_colors` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `metal_purities` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `metal_id` smallint(5) unsigned NOT NULL,
  `name` varchar(30) NOT NULL,
  `purity_percent` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_metal_purity` (`metal_id`,`name`),
  CONSTRAINT `fk_purity_metal` FOREIGN KEY (`metal_id`) REFERENCES `metals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `metal_rates` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `purity_id` smallint(5) unsigned NOT NULL,
  `rate_per_gram` decimal(12,2) NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'BDT',
  `effective_from` datetime NOT NULL,
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_rate_lookup` (`purity_id`,`effective_from`),
  CONSTRAINT `fk_rate_purity` FOREIGN KEY (`purity_id`) REFERENCES `metal_purities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `metals` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `occasions` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `slug` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `variant_id` bigint(20) unsigned DEFAULT NULL,
  `product_name` varchar(200) NOT NULL,
  `variant_sku` varchar(64) NOT NULL,
  `serial_number` varchar(80) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `metal` varchar(30) DEFAULT NULL,
  `purity` varchar(10) DEFAULT NULL,
  `metal_color` varchar(30) DEFAULT NULL,
  `size_label` varchar(40) DEFAULT NULL,
  `metal_weight_g` decimal(8,2) DEFAULT NULL,
  `diamond_carat` decimal(7,2) DEFAULT NULL,
  `stone_count` int(10) unsigned DEFAULT NULL,
  `certificate_no` varchar(60) DEFAULT NULL,
  `certificate_issuer` varchar(30) DEFAULT NULL,
  `making_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stone_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `metal_rate` decimal(12,2) DEFAULT NULL,
  `quantity` int(10) unsigned NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  `engraving` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_oi_order` (`order_id`),
  KEY `fk_oi_variant` (`variant_id`),
  CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `order_status_history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `from_status` varchar(30) DEFAULT NULL,
  `to_status` varchar(30) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `changed_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_osh_order` (`order_id`),
  CONSTRAINT `fk_osh_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_no` varchar(30) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `address_id` bigint(20) unsigned DEFAULT NULL,
  `status` enum('reserved','pending','confirmed','processing','crafting','hallmarking','diamond_setting','polishing','quality_check','packed','ready_to_ship','shipped','out_for_delivery','delivered','cancelled','returned','refunded','expired') NOT NULL DEFAULT 'pending',
  `is_test` tinyint(1) NOT NULL DEFAULT 0,
  `reserved_until` datetime DEFAULT NULL,
  `currency` char(3) NOT NULL DEFAULT 'BDT',
  `subtotal` decimal(12,2) NOT NULL,
  `making_charge_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stone_charge_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `shipping_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(12,2) NOT NULL,
  `payment_method` enum('cod','stripe','bkash','nagad','rocket','card') NOT NULL DEFAULT 'cod',
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `coupon_id` int(10) unsigned DEFAULT NULL,
  `coupon_code` varchar(40) DEFAULT NULL,
  `shipping_name` varchar(120) DEFAULT NULL,
  `shipping_phone` varchar(30) DEFAULT NULL,
  `shipping_address` varchar(500) DEFAULT NULL,
  `shipping_label` varchar(40) DEFAULT NULL,
  `shipping_city` varchar(80) DEFAULT NULL,
  `shipping_district` varchar(80) DEFAULT NULL,
  `shipping_postcode` varchar(20) DEFAULT NULL,
  `shipping_country` char(2) NOT NULL DEFAULT 'BD',
  `billing_address` varchar(500) DEFAULT NULL,
  `customer_note` varchar(500) DEFAULT NULL,
  `gift_message` varchar(300) DEFAULT NULL,
  `internal_note` varchar(1000) DEFAULT NULL,
  `placed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_no` (`order_no`),
  KEY `fk_order_user` (`user_id`),
  KEY `fk_order_coupon` (`coupon_id`),
  KEY `idx_orders_status` (`status`,`placed_at`),
  KEY `idx_orders_reserved` (`status`,`reserved_until`),
  KEY `idx_orders_is_test` (`is_test`,`placed_at`),
  CONSTRAINT `fk_order_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `pages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `body` mediumtext DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `payment_transactions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `method` enum('cod','bkash','nagad','rocket','card','bank_transfer','emi') NOT NULL,
  `type` enum('payment','refund') NOT NULL DEFAULT 'payment',
  `status` enum('pending','success','failed','cancelled') NOT NULL DEFAULT 'pending',
  `amount` decimal(12,2) NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'BDT',
  `gateway_txn_id` varchar(120) DEFAULT NULL,
  `gateway_payload` text DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ptx_order` (`order_id`),
  CONSTRAINT `fk_ptx_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `permissions` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(80) NOT NULL,
  `name` varchar(120) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `price_history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint(20) unsigned NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `sale_price` decimal(12,2) DEFAULT NULL,
  `currency` char(3) NOT NULL DEFAULT 'BDT',
  `effective_at` datetime NOT NULL,
  `reason` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ph_variant` (`variant_id`,`effective_at`),
  CONSTRAINT `fk_ph_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `product_categories` (
  `product_id` bigint(20) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `fk_pc_category` (`category_id`),
  CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `product_collections` (
  `product_id` bigint(20) unsigned NOT NULL,
  `collection_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`product_id`,`collection_id`),
  KEY `fk_pcol_collection` (`collection_id`),
  CONSTRAINT `fk_pcol_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pcol_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `product_genders` (
  `product_id` bigint(20) unsigned NOT NULL,
  `gender_id` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`product_id`,`gender_id`),
  KEY `fk_pg_gender` (`gender_id`),
  CONSTRAINT `fk_pg_gender` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pg_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `product_images` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `variant_id` bigint(20) unsigned DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `is_360` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_img_variant` (`variant_id`),
  KEY `idx_img_product` (`product_id`,`sort_order`),
  CONSTRAINT `fk_img_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_img_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `product_occasions` (
  `product_id` bigint(20) unsigned NOT NULL,
  `occasion_id` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`product_id`,`occasion_id`),
  KEY `fk_po_occasion` (`occasion_id`),
  CONSTRAINT `fk_po_occasion` FOREIGN KEY (`occasion_id`) REFERENCES `occasions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_po_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `product_specifications` (
  `product_id` bigint(20) unsigned NOT NULL,
  `attribute_id` smallint(5) unsigned NOT NULL,
  `value` varchar(120) NOT NULL,
  PRIMARY KEY (`product_id`,`attribute_id`),
  KEY `fk_prodspec_attribute` (`attribute_id`),
  CONSTRAINT `fk_prodspec_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_prodspec_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `product_styles` (
  `product_id` bigint(20) unsigned NOT NULL,
  `style_id` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`product_id`,`style_id`),
  KEY `fk_ps_style` (`style_id`),
  CONSTRAINT `fk_ps_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ps_style` FOREIGN KEY (`style_id`) REFERENCES `styles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `product_tags` (
  `product_id` bigint(20) unsigned NOT NULL,
  `tag_id` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`product_id`,`tag_id`),
  KEY `fk_pt_tag` (`tag_id`),
  CONSTRAINT `fk_pt_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pt_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `product_variants` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `variant_sku` varchar(64) NOT NULL,
  `barcode` varchar(64) DEFAULT NULL,
  `metal_id` smallint(5) unsigned DEFAULT NULL,
  `purity_id` smallint(5) unsigned DEFAULT NULL,
  `metal_color_id` smallint(5) unsigned DEFAULT NULL,
  `metal_weight_g` decimal(10,3) DEFAULT NULL,
  `gross_weight_g` decimal(10,3) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `variant_sku` (`variant_sku`),
  KEY `fk_var_metal` (`metal_id`),
  KEY `fk_var_purity` (`purity_id`),
  KEY `fk_var_color` (`metal_color_id`),
  KEY `idx_var_product` (`product_id`),
  CONSTRAINT `fk_var_color` FOREIGN KEY (`metal_color_id`) REFERENCES `metal_colors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_var_metal` FOREIGN KEY (`metal_id`) REFERENCES `metals` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_var_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_var_purity` FOREIGN KEY (`purity_id`) REFERENCES `metal_purities` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sku` varchar(64) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `name` varchar(200) NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `brand_id` int(10) unsigned DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `care_instructions` text DEFAULT NULL,
  `status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_new_arrival` tinyint(1) NOT NULL DEFAULT 0,
  `is_best_seller` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_prod_brand` (`brand_id`),
  KEY `idx_products_status` (`status`),
  KEY `idx_products_flags` (`is_featured`,`is_new_arrival`,`is_best_seller`),
  FULLTEXT KEY `ft_products` (`name`,`short_description`),
  CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `refunds` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `return_id` bigint(20) unsigned DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(40) NOT NULL,
  `status` enum('pending','processed','failed') NOT NULL DEFAULT 'pending',
  `processed_at` datetime DEFAULT NULL,
  `processed_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_ref_order` (`order_id`),
  KEY `fk_ref_return` (`return_id`),
  CONSTRAINT `fk_ref_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ref_return` FOREIGN KEY (`return_id`) REFERENCES `returns` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `returns` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `order_item_id` bigint(20) unsigned DEFAULT NULL,
  `reason` varchar(255) NOT NULL,
  `status` enum('requested','approved','rejected','received','refunded') NOT NULL DEFAULT 'requested',
  `quantity` int(10) unsigned NOT NULL DEFAULT 1,
  `note` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_ret_order` (`order_id`),
  KEY `fk_ret_item` (`order_item_id`),
  CONSTRAINT `fk_ret_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ret_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `review_helpful` (
  `review_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`review_id`,`user_id`),
  KEY `fk_helpful_user` (`user_id`),
  CONSTRAINT `fk_helpful_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_helpful_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `review_media` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `review_id` bigint(20) unsigned NOT NULL,
  `path` varchar(255) NOT NULL,
  `kind` enum('image','video') NOT NULL DEFAULT 'image',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_review_media` (`review_id`,`sort_order`),
  CONSTRAINT `fk_review_media_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `rating` tinyint(3) unsigned NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `reply` text DEFAULT NULL,
  `replied_at` datetime DEFAULT NULL,
  `helpful_count` int(10) unsigned NOT NULL DEFAULT 0,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_review_user_product` (`product_id`,`user_id`),
  UNIQUE KEY `uq_review` (`product_id`,`user_id`,`order_id`),
  KEY `fk_rev_user` (`user_id`),
  KEY `fk_rev_order` (`order_id`),
  CONSTRAINT `fk_rev_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_rev_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `role_permissions` (
  `role_id` smallint(5) unsigned NOT NULL,
  `permission_id` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `fk_rp_perm` (`permission_id`),
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `roles` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `seo_meta` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(40) NOT NULL,
  `entity_id` bigint(20) unsigned NOT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` varchar(320) DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `canonical_url` varchar(255) DEFAULT NULL,
  `og_image` varchar(255) DEFAULT NULL,
  `schema_json` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_seo_entity` (`entity_type`,`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `shipments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `courier` varchar(80) DEFAULT NULL,
  `tracking_no` varchar(120) DEFAULT NULL,
  `status` enum('pending','picked','in_transit','delivered','failed','returned') NOT NULL DEFAULT 'pending',
  `shipped_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_ship_order` (`order_id`),
  CONSTRAINT `fk_ship_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `stone_clarities` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `stone_colors` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `stone_cuts` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `stone_shapes` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `stone_types` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `styles` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `slug` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `tags` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `slug` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `testimonials` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author_name` varchar(120) NOT NULL,
  `author_title` varchar(120) DEFAULT NULL,
  `quote` text NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `url_redirects` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `from_path` varchar(255) NOT NULL,
  `to_path` varchar(255) NOT NULL,
  `status_code` smallint(5) unsigned NOT NULL DEFAULT 301,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `from_path` (`from_path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `avatar_path` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `phone_verified_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `notify_order` tinyint(1) NOT NULL DEFAULT 1,
  `notify_offers` tinyint(1) NOT NULL DEFAULT 0,
  `notify_sms` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `variant_attributes` (
  `variant_id` bigint(20) unsigned NOT NULL,
  `attribute_value_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`variant_id`,`attribute_value_id`),
  KEY `fk_va_value` (`attribute_value_id`),
  CONSTRAINT `fk_va_value` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_va_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `variant_price_components` (
  `variant_id` bigint(20) unsigned NOT NULL,
  `pricing_mode` enum('fixed','rate_based') NOT NULL DEFAULT 'rate_based',
  `fixed_price` decimal(12,2) DEFAULT NULL,
  `compare_price` decimal(12,2) DEFAULT NULL,
  `cost_price` decimal(12,2) DEFAULT NULL,
  `stone_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `making_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `wastage_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_percent` decimal(5,2) NOT NULL DEFAULT 5.00,
  PRIMARY KEY (`variant_id`),
  CONSTRAINT `fk_vpc_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `variant_stones` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint(20) unsigned NOT NULL,
  `stone_type_id` smallint(5) unsigned NOT NULL,
  `stone_shape_id` smallint(5) unsigned DEFAULT NULL,
  `stone_color_id` smallint(5) unsigned DEFAULT NULL,
  `stone_clarity_id` smallint(5) unsigned DEFAULT NULL,
  `stone_cut_id` smallint(5) unsigned DEFAULT NULL,
  `is_lab_grown` tinyint(1) NOT NULL DEFAULT 0,
  `carat_each` decimal(8,3) DEFAULT NULL,
  `carat_total` decimal(8,3) DEFAULT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT 1,
  `is_center_stone` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_vs_type` (`stone_type_id`),
  KEY `fk_vs_shape` (`stone_shape_id`),
  KEY `fk_vs_color` (`stone_color_id`),
  KEY `fk_vs_clarity` (`stone_clarity_id`),
  KEY `fk_vs_cut` (`stone_cut_id`),
  KEY `idx_vs_variant` (`variant_id`),
  CONSTRAINT `fk_vs_clarity` FOREIGN KEY (`stone_clarity_id`) REFERENCES `stone_clarities` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vs_color` FOREIGN KEY (`stone_color_id`) REFERENCES `stone_colors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vs_cut` FOREIGN KEY (`stone_cut_id`) REFERENCES `stone_cuts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vs_shape` FOREIGN KEY (`stone_shape_id`) REFERENCES `stone_shapes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vs_type` FOREIGN KEY (`stone_type_id`) REFERENCES `stone_types` (`id`),
  CONSTRAINT `fk_vs_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `warehouses` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `type` enum('warehouse','store') NOT NULL DEFAULT 'warehouse',
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `wishlists` (
  `user_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`product_id`),
  KEY `fk_wl_product` (`product_id`),
  CONSTRAINT `fk_wl_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wl_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Reference data ──────────────────────────────────────────────────────────
-- Lookups only, plus the testimonials the landing page ships with. Nothing here
-- is a product, a customer or an order.

LOCK TABLES `attribute_values` WRITE;
/*!40000 ALTER TABLE `attribute_values` DISABLE KEYS */;
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (1,1,'5',1);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (2,1,'6',2);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (3,1,'7',3);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (4,1,'8',4);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (5,1,'9',5);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (6,2,'16 inch',1);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (7,2,'18 inch',2);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (8,2,'20 inch',3);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (9,2,'22 inch',4);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (10,3,'2.4',1);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (11,3,'2.6',2);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (12,3,'2.8',3);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (13,4,'1',1);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (14,4,'3',2);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (15,4,'5',3);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (16,4,'7',4);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (17,4,'13',5);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (18,4,'25',6);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (19,5,'Screw',1);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (20,5,'Wire',2);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (21,6,'Push Back',1);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (22,6,'Screw Back',2);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (23,6,'Hook',3);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (28,10,'7 mm',3);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (29,10,'8 mm',4);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (30,9,'3 mm',1);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (31,8,'8 mm',1);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (32,7,'12 mm',1);
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES (33,11,'22G',1);
/*!40000 ALTER TABLE `attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (1,'Ring Size','ring_size','select',1,1,1);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (2,'Length','chain_length','select',1,1,2);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (3,'Bangle Size','bangle_size','select',1,1,3);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (4,'Stone Count','stone_count','select',1,1,4);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (5,'Nose Pin Type','nose_pin_type','select',1,1,5);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (6,'Earring Closure','earring_closure','select',1,1,6);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (7,'Height','height','text',0,0,7);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (8,'Width','width','text',0,0,8);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (9,'Thickness','thickness','text',0,0,9);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (10,'Pin Length','pin_length','text',0,0,10);
INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES (11,'Gauge','gauge','text',0,0,11);
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (1,NULL,'Rings','rings','/uploads/categories/rings.jpg?v=1783939617127',NULL,1,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (2,NULL,'Earrings','earrings','/uploads/categories/earrings.jpg?v=1783939626729',NULL,2,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (3,NULL,'Necklaces','necklaces','/uploads/categories/necklaces.jpg?v=1783984334126',NULL,3,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (4,NULL,'Pendants','pendants',NULL,NULL,4,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (5,NULL,'Bracelets','bracelets','/uploads/categories/bracelets.jpg?v=1783941179168',NULL,5,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (6,NULL,'Bangles','bangles','/uploads/categories/bangles.jpg?v=1783984373142',NULL,6,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (7,NULL,'Chains','chains','/uploads/categories/chains.jpg?v=1783941138723',NULL,7,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (8,NULL,'Lockets','lockets',NULL,NULL,8,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (9,NULL,'Nose Pins','nose-pins','/uploads/categories/nose-pins.jpg?v=1783941089516',NULL,9,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (10,NULL,'Bridal Sets','bridal-sets','/uploads/categories/bridal-sets.jpg?v=1783941067015',NULL,10,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (11,NULL,'Traditional Jewellery','traditional-jewellery',NULL,NULL,11,1,'2026-07-09 10:50:33');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES (15,NULL,'Sitahar','sitahar','/uploads/categories/sitahar.jpg?v=1783939603001',NULL,0,1,'2026-07-12 13:32:52');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
INSERT INTO `collections` (`id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_featured`, `is_active`, `starts_at`, `ends_at`, `created_at`) VALUES (1,'Royal Heritage','royal-heritage',NULL,NULL,1,0,1,NULL,NULL,'2026-07-09 10:50:33');
INSERT INTO `collections` (`id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_featured`, `is_active`, `starts_at`, `ends_at`, `created_at`) VALUES (2,'Classic','classic',NULL,NULL,2,0,1,NULL,NULL,'2026-07-09 10:50:33');
INSERT INTO `collections` (`id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_featured`, `is_active`, `starts_at`, `ends_at`, `created_at`) VALUES (3,'Minimal','minimal',NULL,NULL,3,0,1,NULL,NULL,'2026-07-09 10:50:33');
INSERT INTO `collections` (`id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_featured`, `is_active`, `starts_at`, `ends_at`, `created_at`) VALUES (4,'Wedding','wedding',NULL,NULL,4,0,1,NULL,NULL,'2026-07-09 10:50:33');
INSERT INTO `collections` (`id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_featured`, `is_active`, `starts_at`, `ends_at`, `created_at`) VALUES (5,'Luxury','luxury',NULL,NULL,5,0,1,NULL,NULL,'2026-07-09 10:50:33');
INSERT INTO `collections` (`id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_featured`, `is_active`, `starts_at`, `ends_at`, `created_at`) VALUES (6,'Limited Edition','limited-edition',NULL,NULL,6,0,1,NULL,NULL,'2026-07-09 10:50:33');
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `genders` WRITE;
/*!40000 ALTER TABLE `genders` DISABLE KEYS */;
INSERT INTO `genders` (`id`, `name`) VALUES (3,'Kids');
INSERT INTO `genders` (`id`, `name`) VALUES (2,'Men');
INSERT INTO `genders` (`id`, `name`) VALUES (4,'Unisex');
INSERT INTO `genders` (`id`, `name`) VALUES (1,'Women');
/*!40000 ALTER TABLE `genders` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (1,1,NULL,'New Arrivals','/shop?sort=new',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (2,1,NULL,'Gold','/shop?material=Gold',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (3,1,NULL,'Diamond','/shop?material=Diamond',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (4,1,NULL,'Bridal','/shop?occasion=Wedding,Engagement',NULL,4,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (5,1,NULL,'Collections','/shop?collection=Luxury',NULL,5,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (6,1,NULL,'Gifts','/shop?occasion=Anniversary,Festival',NULL,6,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (7,1,NULL,'About','/#craft',NULL,7,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (8,1,NULL,'Contact','/#appointment',NULL,8,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (9,2,NULL,'Shop by Category','#',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (10,2,NULL,'Shop by Purity','#',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (11,2,NULL,'Shop by Gold Color','#',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (12,2,NULL,'Shop by Recipient','#',NULL,4,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (13,2,NULL,'Shop by Occasion','#',NULL,5,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (14,2,NULL,'Shop by Price','#',NULL,6,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (15,2,9,'Rings','/shop?material=Gold&type=Ring',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (16,2,9,'Earrings','/shop?material=Gold&type=Earring',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (17,2,9,'Necklaces','/shop?material=Gold&type=Necklace',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (18,2,9,'Pendants','/shop?material=Gold&type=Pendant',NULL,4,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (19,2,9,'Bracelets','/shop?material=Gold&type=Bracelet',NULL,5,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (20,2,9,'Bangles','/shop?material=Gold&type=Bangle',NULL,6,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (21,2,9,'Chains','/shop?material=Gold&type=Chain',NULL,7,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (22,2,9,'Lockets','/shop?material=Gold&type=Locket',NULL,8,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (23,2,9,'Nose Pins','/shop?material=Gold&type=Nose+Pin',NULL,9,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (24,2,9,'Bridal Sets','/shop?material=Gold&occasion=Wedding',NULL,10,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (25,2,9,'Traditional Jewellery','/shop?material=Gold&style=Polki,Vintage',NULL,11,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (26,2,10,'24K','/shop?material=Gold&purity=24K',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (27,2,10,'22K','/shop?material=Gold&purity=22K',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (28,2,10,'21K','/shop?material=Gold&purity=21K',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (29,2,10,'18K','/shop?material=Gold&purity=18K',NULL,4,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (30,2,10,'14K','/shop?material=Gold&purity=14K',NULL,5,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (31,2,11,'Yellow Gold','/shop?material=Gold&color=Yellow+Gold',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (32,2,11,'White Gold','/shop?material=Gold&color=White+Gold',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (33,2,11,'Rose Gold','/shop?material=Gold&color=Rose+Gold',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (34,2,12,'Women','/shop?material=Gold&gender=Women',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (35,2,12,'Men','/shop?material=Gold&gender=Men',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (36,2,12,'Kids','/shop?material=Gold&gender=Kids',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (37,2,13,'Wedding','/shop?material=Gold&occasion=Wedding',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (38,2,13,'Engagement','/shop?material=Gold&occasion=Engagement',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (39,2,13,'Anniversary','/shop?material=Gold&occasion=Anniversary',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (40,2,13,'Festival','/shop?material=Gold&occasion=Festival',NULL,4,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (41,2,14,'Under ৳50,000','/shop?material=Gold&price=under-50k',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (42,2,14,'৳50K – ৳100K','/shop?material=Gold&price=50k-100k',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (43,2,14,'৳100K – ৳250K','/shop?material=Gold&price=100k-250k',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (44,2,14,'৳250K+','/shop?material=Gold&price=250k-plus',NULL,4,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (46,3,NULL,'Shop by Category','#',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (47,3,NULL,'Shop by Diamond Style','#',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (48,3,NULL,'Shop by Recipient','#',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (49,3,NULL,'Shop by Price','#',NULL,4,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (50,3,NULL,'Shop by Collection','#',NULL,5,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (51,3,46,'Rings','/shop?material=Diamond&type=Ring',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (52,3,46,'Necklaces','/shop?material=Diamond&type=Necklace',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (53,3,46,'Bracelets','/shop?material=Diamond&type=Bracelet',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (54,3,46,'Earrings','/shop?material=Diamond&type=Earring',NULL,4,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (55,3,46,'Pendants','/shop?material=Diamond&type=Pendant',NULL,5,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (56,3,46,'Bangles','/shop?material=Diamond&type=Bangle',NULL,6,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (57,3,46,'Lockets','/shop?material=Diamond&type=Locket',NULL,7,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (58,3,46,'Chains','/shop?material=Diamond&type=Chain',NULL,8,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (59,3,46,'Nose Pins','/shop?material=Diamond&type=Nose+Pin',NULL,9,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (60,3,47,'Solitaire','/shop?material=Diamond&style=Solitaire',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (61,3,47,'Halo','/shop?material=Diamond&style=Halo',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (62,3,47,'Cocktail','/shop?material=Diamond&style=Cocktail',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (63,3,47,'Color Stone','/shop?material=Diamond&style=Color+Stone',NULL,4,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (64,3,47,'Designer','/shop?material=Diamond&style=Designer',NULL,5,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (65,3,47,'Polki','/shop?material=Diamond&style=Polki',NULL,6,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (66,3,48,'Women','/shop?material=Diamond&gender=Women',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (67,3,48,'Men','/shop?material=Diamond&gender=Men',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (68,3,48,'Kids','/shop?material=Diamond&gender=Kids',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (69,3,49,'Under ৳100K','/shop?material=Diamond&price=under-50k,50k-100k',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (70,3,49,'৳100K – ৳250K','/shop?material=Diamond&price=100k-250k',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (71,3,49,'৳250K+','/shop?material=Diamond&price=250k-plus',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (72,3,50,'Royal Heritage','/shop?collection=Royal+Heritage',NULL,1,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (73,3,50,'Luxury','/shop?collection=Luxury',NULL,2,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (74,3,50,'Wedding','/shop?collection=Wedding',NULL,3,1);
INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES (75,3,50,'Minimal','/shop?collection=Minimal',NULL,4,1);
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` (`id`, `name`, `code`, `is_active`) VALUES (1,'Primary Navigation','primary',1);
INSERT INTO `menus` (`id`, `name`, `code`, `is_active`) VALUES (2,'Gold Mega Menu','gold_mega',1);
INSERT INTO `menus` (`id`, `name`, `code`, `is_active`) VALUES (3,'Diamond Mega Menu','diamond_mega',1);
INSERT INTO `menus` (`id`, `name`, `code`, `is_active`) VALUES (4,'Mobile Menu','mobile',1);
INSERT INTO `menus` (`id`, `name`, `code`, `is_active`) VALUES (5,'Footer Menu','footer',1);
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `metal_colors` WRITE;
/*!40000 ALTER TABLE `metal_colors` DISABLE KEYS */;
INSERT INTO `metal_colors` (`id`, `name`) VALUES (3,'Rose Gold');
INSERT INTO `metal_colors` (`id`, `name`) VALUES (2,'White Gold');
INSERT INTO `metal_colors` (`id`, `name`) VALUES (1,'Yellow Gold');
/*!40000 ALTER TABLE `metal_colors` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `metal_purities` WRITE;
/*!40000 ALTER TABLE `metal_purities` DISABLE KEYS */;
INSERT INTO `metal_purities` (`id`, `metal_id`, `name`, `purity_percent`) VALUES (1,1,'24K',99.99);
INSERT INTO `metal_purities` (`id`, `metal_id`, `name`, `purity_percent`) VALUES (2,1,'22K',91.60);
INSERT INTO `metal_purities` (`id`, `metal_id`, `name`, `purity_percent`) VALUES (3,1,'21K',87.50);
INSERT INTO `metal_purities` (`id`, `metal_id`, `name`, `purity_percent`) VALUES (4,1,'18K',75.00);
INSERT INTO `metal_purities` (`id`, `metal_id`, `name`, `purity_percent`) VALUES (5,1,'14K',58.30);
INSERT INTO `metal_purities` (`id`, `metal_id`, `name`, `purity_percent`) VALUES (6,2,'PT950',95.00);
INSERT INTO `metal_purities` (`id`, `metal_id`, `name`, `purity_percent`) VALUES (7,3,'S925',92.50);
/*!40000 ALTER TABLE `metal_purities` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `metal_rates` WRITE;
/*!40000 ALTER TABLE `metal_rates` DISABLE KEYS */;
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (1,1,11500.00,'BDT','2026-07-09 16:50:33',NULL,'2026-07-09 10:50:33');
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (2,2,10550.00,'BDT','2026-07-09 16:50:33',NULL,'2026-07-09 10:50:33');
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (3,3,10050.00,'BDT','2026-07-09 16:50:33',NULL,'2026-07-09 10:50:33');
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (4,4,8650.00,'BDT','2026-07-09 16:50:33',NULL,'2026-07-09 10:50:33');
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (5,5,6700.00,'BDT','2026-07-09 16:50:33',NULL,'2026-07-09 10:50:33');
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (6,2,10725.50,'BDT','2026-07-09 17:19:37',NULL,'2026-07-09 11:19:37');
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (7,1,10000.00,'BDT','2026-07-09 21:54:00',NULL,'2026-07-09 15:54:00');
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (8,1,12000.00,'BDT','2026-07-09 21:54:19',NULL,'2026-07-09 15:54:19');
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (9,1,13000.00,'BDT','2026-07-09 21:54:54',NULL,'2026-07-09 15:54:54');
INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES (12,1,200000.00,'BDT','2026-07-14 05:37:28',NULL,'2026-07-13 23:37:28');
/*!40000 ALTER TABLE `metal_rates` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `metals` WRITE;
/*!40000 ALTER TABLE `metals` DISABLE KEYS */;
INSERT INTO `metals` (`id`, `name`) VALUES (1,'Gold');
INSERT INTO `metals` (`id`, `name`) VALUES (2,'Platinum');
INSERT INTO `metals` (`id`, `name`) VALUES (3,'Silver');
/*!40000 ALTER TABLE `metals` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `occasions` WRITE;
/*!40000 ALTER TABLE `occasions` DISABLE KEYS */;
INSERT INTO `occasions` (`id`, `name`, `slug`) VALUES (1,'Wedding','wedding');
INSERT INTO `occasions` (`id`, `name`, `slug`) VALUES (2,'Engagement','engagement');
INSERT INTO `occasions` (`id`, `name`, `slug`) VALUES (3,'Anniversary','anniversary');
INSERT INTO `occasions` (`id`, `name`, `slug`) VALUES (4,'Birthday','birthday');
INSERT INTO `occasions` (`id`, `name`, `slug`) VALUES (5,'Festival','festival');
INSERT INTO `occasions` (`id`, `name`, `slug`) VALUES (6,'Daily Wear','daily-wear');
/*!40000 ALTER TABLE `occasions` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` (`id`, `code`, `name`) VALUES (1,'products.manage','Manage products');
INSERT INTO `permissions` (`id`, `code`, `name`) VALUES (2,'rates.update','Update metal rates');
INSERT INTO `permissions` (`id`, `code`, `name`) VALUES (3,'inventory.adjust','Adjust inventory');
INSERT INTO `permissions` (`id`, `code`, `name`) VALUES (4,'orders.manage','Manage orders');
INSERT INTO `permissions` (`id`, `code`, `name`) VALUES (5,'discounts.approve','Approve discounts');
INSERT INTO `permissions` (`id`, `code`, `name`) VALUES (6,'cms.manage','Manage CMS content');
INSERT INTO `permissions` (`id`, `code`, `name`) VALUES (7,'admin.manage','Manage admin users');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (1,1);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (1,2);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (1,3);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (1,4);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (1,5);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (1,6);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (1,7);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (2,1);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (2,3);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (2,4);
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES (2,6);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `name`) VALUES (2,'Manager');
INSERT INTO `roles` (`id`, `name`) VALUES (3,'Staff');
INSERT INTO `roles` (`id`, `name`) VALUES (1,'Super Admin');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `stone_clarities` WRITE;
/*!40000 ALTER TABLE `stone_clarities` DISABLE KEYS */;
INSERT INTO `stone_clarities` (`id`, `name`) VALUES (1,'IF');
INSERT INTO `stone_clarities` (`id`, `name`) VALUES (6,'SI1');
INSERT INTO `stone_clarities` (`id`, `name`) VALUES (7,'SI2');
INSERT INTO `stone_clarities` (`id`, `name`) VALUES (4,'VS1');
INSERT INTO `stone_clarities` (`id`, `name`) VALUES (5,'VS2');
INSERT INTO `stone_clarities` (`id`, `name`) VALUES (2,'VVS1');
INSERT INTO `stone_clarities` (`id`, `name`) VALUES (3,'VVS2');
/*!40000 ALTER TABLE `stone_clarities` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `stone_colors` WRITE;
/*!40000 ALTER TABLE `stone_colors` DISABLE KEYS */;
INSERT INTO `stone_colors` (`id`, `name`) VALUES (1,'D');
INSERT INTO `stone_colors` (`id`, `name`) VALUES (2,'E');
INSERT INTO `stone_colors` (`id`, `name`) VALUES (3,'F');
INSERT INTO `stone_colors` (`id`, `name`) VALUES (4,'G');
INSERT INTO `stone_colors` (`id`, `name`) VALUES (5,'H');
INSERT INTO `stone_colors` (`id`, `name`) VALUES (6,'I');
INSERT INTO `stone_colors` (`id`, `name`) VALUES (7,'J');
/*!40000 ALTER TABLE `stone_colors` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `stone_cuts` WRITE;
/*!40000 ALTER TABLE `stone_cuts` DISABLE KEYS */;
INSERT INTO `stone_cuts` (`id`, `name`) VALUES (1,'Excellent');
INSERT INTO `stone_cuts` (`id`, `name`) VALUES (3,'Good');
INSERT INTO `stone_cuts` (`id`, `name`) VALUES (2,'Very Good');
/*!40000 ALTER TABLE `stone_cuts` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `stone_shapes` WRITE;
/*!40000 ALTER TABLE `stone_shapes` DISABLE KEYS */;
INSERT INTO `stone_shapes` (`id`, `name`) VALUES (7,'Cushion');
INSERT INTO `stone_shapes` (`id`, `name`) VALUES (5,'Emerald');
INSERT INTO `stone_shapes` (`id`, `name`) VALUES (6,'Heart');
INSERT INTO `stone_shapes` (`id`, `name`) VALUES (8,'Marquise');
INSERT INTO `stone_shapes` (`id`, `name`) VALUES (2,'Oval');
INSERT INTO `stone_shapes` (`id`, `name`) VALUES (4,'Pear');
INSERT INTO `stone_shapes` (`id`, `name`) VALUES (3,'Princess');
INSERT INTO `stone_shapes` (`id`, `name`) VALUES (1,'Round');
/*!40000 ALTER TABLE `stone_shapes` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `stone_types` WRITE;
/*!40000 ALTER TABLE `stone_types` DISABLE KEYS */;
INSERT INTO `stone_types` (`id`, `name`) VALUES (1,'Diamond');
INSERT INTO `stone_types` (`id`, `name`) VALUES (3,'Emerald');
INSERT INTO `stone_types` (`id`, `name`) VALUES (5,'Pearl');
INSERT INTO `stone_types` (`id`, `name`) VALUES (6,'Polki');
INSERT INTO `stone_types` (`id`, `name`) VALUES (2,'Ruby');
INSERT INTO `stone_types` (`id`, `name`) VALUES (4,'Sapphire');
/*!40000 ALTER TABLE `stone_types` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `styles` WRITE;
/*!40000 ALTER TABLE `styles` DISABLE KEYS */;
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (1,'Solitaire','solitaire');
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (2,'Halo','halo');
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (3,'Cocktail','cocktail');
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (4,'Color Stone','color-stone');
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (5,'Multi Stone','multi-stone');
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (6,'Single Stone','single-stone');
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (7,'Vintage','vintage');
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (8,'Minimal','minimal');
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (9,'Designer','designer');
INSERT INTO `styles` (`id`, `name`, `slug`) VALUES (10,'Polki','polki');
/*!40000 ALTER TABLE `styles` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` (`id`, `name`, `slug`) VALUES (1,'Trending','trending');
INSERT INTO `tags` (`id`, `name`, `slug`) VALUES (2,'Editor\'s Choice','editors-choice');
INSERT INTO `tags` (`id`, `name`, `slug`) VALUES (3,'Celebrity','celebrity');
INSERT INTO `tags` (`id`, `name`, `slug`) VALUES (4,'Luxury','luxury');
INSERT INTO `tags` (`id`, `name`, `slug`) VALUES (5,'Best Seller','best-seller');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `warehouses` WRITE;
/*!40000 ALTER TABLE `warehouses` DISABLE KEYS */;
INSERT INTO `warehouses` (`id`, `name`, `type`, `address`, `phone`, `is_active`) VALUES (1,'Main Warehouse','warehouse','Dhaka',NULL,1);
INSERT INTO `warehouses` (`id`, `name`, `type`, `address`, `phone`, `is_active`) VALUES (2,'Dhaka Boutique','store','Gulshan, Dhaka',NULL,1);
INSERT INTO `warehouses` (`id`, `name`, `type`, `address`, `phone`, `is_active`) VALUES (3,'Chittagong Boutique','store','Chittagong',NULL,1);
/*!40000 ALTER TABLE `warehouses` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` (`id`, `author_name`, `author_title`, `quote`, `avatar`, `sort_order`, `is_active`) VALUES (1,'A. de Villiers','Genève','The rivière necklace I commissioned took eight months. When it arrived, my wife wept. Nothing we own compares to it.',NULL,1,1);
INSERT INTO `testimonials` (`id`, `author_name`, `author_title`, `quote`, `avatar`, `sort_order`, `is_active`) VALUES (2,'M. Hartwell','New York','Their private salon experience is unlike anything in Paris. Three generations of my family now wear Nahar Jewellers.',NULL,2,1);
INSERT INTO `testimonials` (`id`, `author_name`, `author_title`, `quote`, `avatar`, `sort_order`, `is_active`) VALUES (3,'S. Al-Rashid','Paris','I have collected high jewelry for twenty years. Nahar Jewellers\' gold work is the finest I have ever held.',NULL,3,1);
INSERT INTO `testimonials` (`id`, `author_name`, `author_title`, `quote`, `avatar`, `sort_order`, `is_active`) VALUES (4,'N. Rahman','Dhaka','From the first sketch to the final polish, they treated my mother\'s heirloom stones with reverence. The reset bangles are breathtaking.',NULL,4,1);
INSERT INTO `testimonials` (`id`, `author_name`, `author_title`, `quote`, `avatar`, `sort_order`, `is_active`) VALUES (5,'E. Whitmore','London','The engagement ring was ready before the promised date, with a certificate for every stone. Service as flawless as the diamond.',NULL,5,1);
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

SET FOREIGN_KEY_CHECKS = 1;
