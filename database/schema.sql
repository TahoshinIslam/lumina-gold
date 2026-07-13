-- ============================================================================
-- LUMINA Jewelry — Full e-commerce schema for MariaDB 10.4 (XAMPP)
-- Modules: Catalog, Attributes, Pricing, Inventory, Ecommerce, CMS,
--          Navigation, SEO, Admin
-- Principle: categories stay simple; details live as attributes/filters;
--            price & stock live at the VARIANT level.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS lumina_jewelry
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lumina_jewelry;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- MODULE 1 — CATALOG
-- ============================================================================

CREATE TABLE brands (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  slug          VARCHAR(140) NOT NULL UNIQUE,
  logo          VARCHAR(255) NULL,
  description   TEXT NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categories (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent_id     INT UNSIGNED NULL,
  name          VARCHAR(120) NOT NULL,
  slug          VARCHAR(140) NOT NULL UNIQUE,
  image         VARCHAR(255) NULL,
  description   TEXT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cat_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE collections (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  slug          VARCHAR(140) NOT NULL UNIQUE,
  image         VARCHAR(255) NULL,
  description   TEXT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_featured   TINYINT(1) NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  starts_at     DATE NULL,
  ends_at       DATE NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE products (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku               VARCHAR(64) NOT NULL UNIQUE,          -- parent SKU
  slug              VARCHAR(180) NOT NULL UNIQUE,
  name              VARCHAR(200) NOT NULL,
  short_description VARCHAR(500) NULL,
  description       MEDIUMTEXT NULL,
  brand_id          INT UNSIGNED NULL,
  video_url         VARCHAR(255) NULL,
  care_instructions TEXT NULL,
  status            ENUM('draft','active','archived') NOT NULL DEFAULT 'draft',
  is_featured       TINYINT(1) NOT NULL DEFAULT 0,
  is_new_arrival    TINYINT(1) NOT NULL DEFAULT 0,
  is_best_seller    TINYINT(1) NOT NULL DEFAULT 0,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prod_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
  FULLTEXT KEY ft_products (name, short_description),
  KEY idx_products_status (status),
  KEY idx_products_flags (is_featured, is_new_arrival, is_best_seller)
) ENGINE=InnoDB;

CREATE TABLE metals (
  id    SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE metal_purities (
  id             SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  metal_id       SMALLINT UNSIGNED NOT NULL,
  name           VARCHAR(30) NOT NULL,                    -- 24K, 22K, 21K, 18K, 14K, PT950
  purity_percent DECIMAL(5,2) NOT NULL,                   -- 99.99, 91.60 ...
  UNIQUE KEY uq_metal_purity (metal_id, name),
  CONSTRAINT fk_purity_metal FOREIGN KEY (metal_id) REFERENCES metals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE metal_colors (
  id    SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(60) NOT NULL UNIQUE                       -- Yellow Gold, White Gold, Rose Gold
) ENGINE=InnoDB;

CREATE TABLE product_variants (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id      BIGINT UNSIGNED NOT NULL,
  variant_sku     VARCHAR(64) NOT NULL UNIQUE,
  barcode         VARCHAR(64) NULL,
  metal_id        SMALLINT UNSIGNED NULL,
  purity_id       SMALLINT UNSIGNED NULL,
  metal_color_id  SMALLINT UNSIGNED NULL,
  metal_weight_g  DECIMAL(10,3) NULL,                     -- grams
  gross_weight_g  DECIMAL(10,3) NULL,
  is_default      TINYINT(1) NOT NULL DEFAULT 0,
  status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_var_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_var_metal   FOREIGN KEY (metal_id) REFERENCES metals(id) ON DELETE SET NULL,
  CONSTRAINT fk_var_purity  FOREIGN KEY (purity_id) REFERENCES metal_purities(id) ON DELETE SET NULL,
  CONSTRAINT fk_var_color   FOREIGN KEY (metal_color_id) REFERENCES metal_colors(id) ON DELETE SET NULL,
  KEY idx_var_product (product_id)
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id  BIGINT UNSIGNED NOT NULL,
  variant_id  BIGINT UNSIGNED NULL,                       -- NULL = applies to whole product
  image_path  VARCHAR(255) NOT NULL,
  alt_text    VARCHAR(200) NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_primary  TINYINT(1) NOT NULL DEFAULT 0,
  is_360      TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_img_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_img_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  KEY idx_img_product (product_id, sort_order)
) ENGINE=InnoDB;

-- ============================================================================
-- MODULE 2 — ATTRIBUTES & FILTERS
-- ============================================================================

CREATE TABLE genders (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE                        -- Women, Men, Kids, Unisex
) ENGINE=InnoDB;

CREATE TABLE occasions (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE styles (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE tags (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- many-to-many pivots (product level)
CREATE TABLE product_categories (
  product_id  BIGINT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, category_id),
  CONSTRAINT fk_pc_product  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_collections (
  product_id    BIGINT UNSIGNED NOT NULL,
  collection_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, collection_id),
  CONSTRAINT fk_pcol_product    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pcol_collection FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_genders (
  product_id BIGINT UNSIGNED NOT NULL,
  gender_id  SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, gender_id),
  CONSTRAINT fk_pg_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pg_gender  FOREIGN KEY (gender_id) REFERENCES genders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_occasions (
  product_id  BIGINT UNSIGNED NOT NULL,
  occasion_id SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, occasion_id),
  CONSTRAINT fk_po_product  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_po_occasion FOREIGN KEY (occasion_id) REFERENCES occasions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_styles (
  product_id BIGINT UNSIGNED NOT NULL,
  style_id   SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, style_id),
  CONSTRAINT fk_ps_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_ps_style   FOREIGN KEY (style_id) REFERENCES styles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_tags (
  product_id BIGINT UNSIGNED NOT NULL,
  tag_id     SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, tag_id),
  CONSTRAINT fk_pt_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pt_tag     FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- stones (diamond + colored stones, per variant, multi-stone capable)
CREATE TABLE stone_types (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE                        -- Diamond, Ruby, Emerald, Pearl...
) ENGINE=InnoDB;

CREATE TABLE stone_shapes (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE                        -- Round, Oval, Princess, Pear...
) ENGINE=InnoDB;

CREATE TABLE stone_colors (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE                        -- D, E, F, G, H...
) ENGINE=InnoDB;

CREATE TABLE stone_clarities (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE                        -- IF, VVS1, VVS2, VS1...
) ENGINE=InnoDB;

CREATE TABLE stone_cuts (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE                        -- Excellent, Very Good, Good
) ENGINE=InnoDB;

CREATE TABLE variant_stones (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  variant_id      BIGINT UNSIGNED NOT NULL,
  stone_type_id   SMALLINT UNSIGNED NOT NULL,
  stone_shape_id  SMALLINT UNSIGNED NULL,
  stone_color_id  SMALLINT UNSIGNED NULL,
  stone_clarity_id SMALLINT UNSIGNED NULL,
  stone_cut_id    SMALLINT UNSIGNED NULL,
  is_lab_grown    TINYINT(1) NOT NULL DEFAULT 0,
  carat_each      DECIMAL(8,3) NULL,
  carat_total     DECIMAL(8,3) NULL,
  quantity        INT UNSIGNED NOT NULL DEFAULT 1,
  is_center_stone TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_vs_variant  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  CONSTRAINT fk_vs_type     FOREIGN KEY (stone_type_id) REFERENCES stone_types(id),
  CONSTRAINT fk_vs_shape    FOREIGN KEY (stone_shape_id) REFERENCES stone_shapes(id) ON DELETE SET NULL,
  CONSTRAINT fk_vs_color    FOREIGN KEY (stone_color_id) REFERENCES stone_colors(id) ON DELETE SET NULL,
  CONSTRAINT fk_vs_clarity  FOREIGN KEY (stone_clarity_id) REFERENCES stone_clarities(id) ON DELETE SET NULL,
  CONSTRAINT fk_vs_cut      FOREIGN KEY (stone_cut_id) REFERENCES stone_cuts(id) ON DELETE SET NULL,
  KEY idx_vs_variant (variant_id)
) ENGINE=InnoDB;

CREATE TABLE certificates (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  variant_id     BIGINT UNSIGNED NOT NULL,
  certificate_no VARCHAR(80) NOT NULL,
  issuer         ENUM('GIA','IGI','HRD','SGL','AGS','Other') NOT NULL DEFAULT 'Other',
  pdf_path       VARCHAR(255) NULL,
  qr_code        VARCHAR(255) NULL,
  issued_at      DATE NULL,
  UNIQUE KEY uq_cert_no (issuer, certificate_no),
  CONSTRAINT fk_cert_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- dynamic attributes (ring size, chain length, bangle size, stone count ...)
CREATE TABLE attributes (
  id           SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(80) NOT NULL UNIQUE,               -- Ring Size, Chain Length...
  code         VARCHAR(80) NOT NULL UNIQUE,               -- ring_size, chain_length...
  input_type   ENUM('select','text','number') NOT NULL DEFAULT 'select',
  is_variant_level TINYINT(1) NOT NULL DEFAULT 1,         -- 1 = varies per variant
  is_filterable TINYINT(1) NOT NULL DEFAULT 1,
  sort_order   INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE attribute_values (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  attribute_id SMALLINT UNSIGNED NOT NULL,
  value        VARCHAR(120) NOT NULL,                     -- "7", "18 inch", "2.6"
  sort_order   INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_attr_value (attribute_id, value),
  CONSTRAINT fk_av_attribute FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE variant_attributes (
  variant_id         BIGINT UNSIGNED NOT NULL,
  attribute_value_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (variant_id, attribute_value_id),
  CONSTRAINT fk_va_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  CONSTRAINT fk_va_value   FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- MODULE 3 — PRICING (gold-rate driven)
-- ============================================================================

CREATE TABLE metal_rates (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  purity_id      SMALLINT UNSIGNED NOT NULL,
  rate_per_gram  DECIMAL(12,2) NOT NULL,                  -- BDT per gram
  currency       CHAR(3) NOT NULL DEFAULT 'BDT',
  effective_from DATETIME NOT NULL,
  created_by     INT UNSIGNED NULL,                       -- admin_users.id
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rate_lookup (purity_id, effective_from),
  CONSTRAINT fk_rate_purity FOREIGN KEY (purity_id) REFERENCES metal_purities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE variant_price_components (
  variant_id      BIGINT UNSIGNED PRIMARY KEY,
  pricing_mode    ENUM('fixed','rate_based') NOT NULL DEFAULT 'rate_based',
  fixed_price     DECIMAL(12,2) NULL,                     -- used when pricing_mode=fixed
  compare_price   DECIMAL(12,2) NULL,                     -- strike-through "was" price, per variant
  cost_price      DECIMAL(12,2) NULL,                     -- internal cost, per variant
  stone_charge    DECIMAL(12,2) NOT NULL DEFAULT 0,
  making_charge   DECIMAL(12,2) NOT NULL DEFAULT 0,
  wastage_percent DECIMAL(5,2)  NOT NULL DEFAULT 0,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_percent     DECIMAL(5,2)  NOT NULL DEFAULT 5.00,    -- VAT
  -- final price = ((metal_rate*weight)*(1+wastage%) + stone + making - discount) * (1+tax%)
  CONSTRAINT fk_vpc_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE price_history (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  variant_id   BIGINT UNSIGNED NOT NULL,
  price        DECIMAL(12,2) NOT NULL,
  sale_price   DECIMAL(12,2) NULL,
  currency     CHAR(3) NOT NULL DEFAULT 'BDT',
  effective_at DATETIME NOT NULL,
  reason       VARCHAR(200) NULL,                         -- "gold rate update", "promo"
  CONSTRAINT fk_ph_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  KEY idx_ph_variant (variant_id, effective_at)
) ENGINE=InnoDB;

CREATE TABLE coupons (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(40) NOT NULL UNIQUE,
  type          ENUM('percent','fixed') NOT NULL,
  value         DECIMAL(12,2) NOT NULL,
  min_order     DECIMAL(12,2) NOT NULL DEFAULT 0,
  max_discount  DECIMAL(12,2) NULL,
  usage_limit   INT UNSIGNED NULL,
  used_count    INT UNSIGNED NOT NULL DEFAULT 0,
  per_user_limit INT UNSIGNED NULL,
  starts_at     DATETIME NULL,
  expires_at    DATETIME NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Time-boxed product promotions (flash sales, seasonal pushes) placed on the
-- storefront home page. See migrations/003_campaigns.sql for the full note.
CREATE TABLE campaigns (
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

CREATE TABLE campaign_products (
  campaign_id INT UNSIGNED NOT NULL,
  product_id  BIGINT UNSIGNED NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  PRIMARY KEY (campaign_id, product_id),
  CONSTRAINT fk_campaign_products_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_campaign_products_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- MODULE 4 — INVENTORY (ledger-based)
-- ============================================================================

CREATE TABLE warehouses (
  id        SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(120) NOT NULL,
  type      ENUM('warehouse','store') NOT NULL DEFAULT 'warehouse',
  address   VARCHAR(255) NULL,
  phone     VARCHAR(30) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE inventory (
  variant_id         BIGINT UNSIGNED NOT NULL,
  warehouse_id       SMALLINT UNSIGNED NOT NULL,
  quantity_available INT NOT NULL DEFAULT 0,
  quantity_reserved  INT NOT NULL DEFAULT 0,
  reorder_level      INT NOT NULL DEFAULT 0,
  availability       ENUM('in_stock','made_to_order','ready_to_ship','out_of_stock')
                     NOT NULL DEFAULT 'in_stock',
  updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (variant_id, warehouse_id),
  CONSTRAINT fk_inv_variant   FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE inventory_movements (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  variant_id     BIGINT UNSIGNED NOT NULL,
  warehouse_id   SMALLINT UNSIGNED NOT NULL,
  movement_type  ENUM('purchase','sale','return','damage','transfer_in','transfer_out',
                      'reservation','release','adjustment','production') NOT NULL,
  quantity       INT NOT NULL,                            -- signed: +in / -out
  reference_type VARCHAR(40) NULL,                        -- 'order','return','po','manual'
  reference_id   BIGINT UNSIGNED NULL,
  note           VARCHAR(255) NULL,
  created_by     INT UNSIGNED NULL,                       -- admin_users.id
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_im_variant   FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  CONSTRAINT fk_im_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  KEY idx_im_variant (variant_id, created_at),
  KEY idx_im_ref (reference_type, reference_id)
) ENGINE=InnoDB;

CREATE TABLE inventory_reservations (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  variant_id   BIGINT UNSIGNED NOT NULL,
  warehouse_id SMALLINT UNSIGNED NOT NULL,
  quantity     INT UNSIGNED NOT NULL,
  order_id     BIGINT UNSIGNED NULL,
  cart_id      BIGINT UNSIGNED NULL,
  status       ENUM('active','fulfilled','released','expired') NOT NULL DEFAULT 'active',
  expires_at   DATETIME NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ir_variant   FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  CONSTRAINT fk_ir_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  KEY idx_ir_status (status, expires_at)
) ENGINE=InnoDB;

-- ============================================================================
-- MODULE 5 — ECOMMERCE
-- ============================================================================

CREATE TABLE users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NULL UNIQUE,
  phone         VARCHAR(30) NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  email_verified_at DATETIME NULL,
  phone_verified_at DATETIME NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE addresses (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  label      VARCHAR(40) NULL,                            -- Home, Office
  name       VARCHAR(120) NOT NULL,
  phone      VARCHAR(30) NOT NULL,
  line1      VARCHAR(255) NOT NULL,
  line2      VARCHAR(255) NULL,
  city       VARCHAR(80) NOT NULL,
  district   VARCHAR(80) NULL,
  postcode   VARCHAR(20) NULL,
  country    CHAR(2) NOT NULL DEFAULT 'BD',
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE wishlists (
  user_id    BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT fk_wl_user    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_wl_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE carts (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NULL,                        -- NULL = guest
  session_id VARCHAR(100) NULL,
  status     ENUM('active','converted','abandoned') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_cart_session (session_id)
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id    BIGINT UNSIGNED NOT NULL,
  variant_id BIGINT UNSIGNED NOT NULL,
  quantity   INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,                      -- snapshot at add time
  engraving  VARCHAR(120) NULL,
  UNIQUE KEY uq_cart_variant (cart_id, variant_id),
  CONSTRAINT fk_ci_cart    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_ci_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE orders (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_no         VARCHAR(30) NOT NULL UNIQUE,           -- LUM-2026-000123
  user_id          BIGINT UNSIGNED NULL,
  status           ENUM('pending','confirmed','processing','ready_to_ship','shipped',
                        'delivered','cancelled','returned','refunded') NOT NULL DEFAULT 'pending',
  currency         CHAR(3) NOT NULL DEFAULT 'BDT',
  subtotal         DECIMAL(12,2) NOT NULL,
  discount_total   DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_total        DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_total   DECIMAL(12,2) NOT NULL DEFAULT 0,
  grand_total      DECIMAL(12,2) NOT NULL,
  coupon_id        INT UNSIGNED NULL,
  shipping_name    VARCHAR(120) NULL,
  shipping_phone   VARCHAR(30) NULL,
  shipping_address VARCHAR(500) NULL,
  billing_address  VARCHAR(500) NULL,
  customer_note    VARCHAR(500) NULL,
  placed_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_user   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_order_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL,
  KEY idx_orders_status (status, placed_at)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id      BIGINT UNSIGNED NOT NULL,
  variant_id    BIGINT UNSIGNED NULL,
  product_name  VARCHAR(200) NOT NULL,                    -- snapshot
  variant_sku   VARCHAR(64) NOT NULL,                     -- snapshot
  metal_rate    DECIMAL(12,2) NULL,                       -- snapshot of rate used
  quantity      INT UNSIGNED NOT NULL,
  unit_price    DECIMAL(12,2) NOT NULL,
  line_total    DECIMAL(12,2) NOT NULL,
  engraving     VARCHAR(120) NULL,
  CONSTRAINT fk_oi_order   FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE order_status_history (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id   BIGINT UNSIGNED NOT NULL,
  from_status VARCHAR(30) NULL,
  to_status  VARCHAR(30) NOT NULL,
  note       VARCHAR(255) NULL,
  changed_by INT UNSIGNED NULL,                           -- admin_users.id, NULL = system/customer
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_osh_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payment_transactions (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id       BIGINT UNSIGNED NOT NULL,
  method         ENUM('cod','bkash','nagad','rocket','card','bank_transfer','emi') NOT NULL,
  type           ENUM('payment','refund') NOT NULL DEFAULT 'payment',
  status         ENUM('pending','success','failed','cancelled') NOT NULL DEFAULT 'pending',
  amount         DECIMAL(12,2) NOT NULL,
  currency       CHAR(3) NOT NULL DEFAULT 'BDT',
  gateway_txn_id VARCHAR(120) NULL,
  gateway_payload TEXT NULL,
  processed_at   DATETIME NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ptx_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  KEY idx_ptx_order (order_id)
) ENGINE=InnoDB;

CREATE TABLE shipments (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id     BIGINT UNSIGNED NOT NULL,
  courier      VARCHAR(80) NULL,                          -- Pathao, Sundarban, DHL...
  tracking_no  VARCHAR(120) NULL,
  status       ENUM('pending','picked','in_transit','delivered','failed','returned')
               NOT NULL DEFAULT 'pending',
  shipped_at   DATETIME NULL,
  delivered_at DATETIME NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ship_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE returns (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    BIGINT UNSIGNED NOT NULL,
  order_item_id BIGINT UNSIGNED NULL,
  reason      VARCHAR(255) NOT NULL,
  status      ENUM('requested','approved','rejected','received','refunded')
              NOT NULL DEFAULT 'requested',
  quantity    INT UNSIGNED NOT NULL DEFAULT 1,
  note        VARCHAR(500) NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ret_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_ret_item  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE refunds (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    BIGINT UNSIGNED NOT NULL,
  return_id   BIGINT UNSIGNED NULL,
  amount      DECIMAL(12,2) NOT NULL,
  method      VARCHAR(40) NOT NULL,                       -- original method / bank
  status      ENUM('pending','processed','failed') NOT NULL DEFAULT 'pending',
  processed_at DATETIME NULL,
  processed_by INT UNSIGNED NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ref_order  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_ref_return FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id  BIGINT UNSIGNED NOT NULL,
  user_id     BIGINT UNSIGNED NOT NULL,
  order_id    BIGINT UNSIGNED NULL,                       -- verified purchase link
  rating      TINYINT UNSIGNED NOT NULL,                  -- 1..5
  title       VARCHAR(150) NULL,
  body        TEXT NULL,
  status      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_review (product_id, user_id, order_id),
  CONSTRAINT fk_rev_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_user    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_order   FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================================
-- MODULE 6 — CMS
-- ============================================================================

CREATE TABLE pages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  slug       VARCHAR(220) NOT NULL UNIQUE,
  body       MEDIUMTEXT NULL,
  status     ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE banners (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  position   VARCHAR(60) NOT NULL,                        -- home_hero, home_mid, shop_top...
  title      VARCHAR(200) NULL,
  subtitle   VARCHAR(300) NULL,
  image      VARCHAR(255) NOT NULL,
  link_url   VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  starts_at  DATETIME NULL,
  ends_at    DATETIME NULL
) ENGINE=InnoDB;

CREATE TABLE blogs (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  slug       VARCHAR(220) NOT NULL UNIQUE,
  excerpt    VARCHAR(500) NULL,
  body       MEDIUMTEXT NULL,
  cover_image VARCHAR(255) NULL,
  author_id  INT UNSIGNED NULL,
  status     ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE faqs (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question   VARCHAR(300) NOT NULL,
  answer     TEXT NOT NULL,
  category   VARCHAR(80) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active  TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE testimonials (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_name VARCHAR(120) NOT NULL,
  author_title VARCHAR(120) NULL,
  quote       TEXT NOT NULL,
  avatar      VARCHAR(255) NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- ============================================================================
-- MODULE 7 — NAVIGATION (menus are design, not classification)
-- ============================================================================

CREATE TABLE menus (
  id       SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(80) NOT NULL,                          -- Primary, Gold Mega, Footer...
  code     VARCHAR(80) NOT NULL UNIQUE,                   -- primary, gold_mega, footer
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE menu_items (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  menu_id    SMALLINT UNSIGNED NOT NULL,
  parent_id  INT UNSIGNED NULL,                           -- column headings are parents
  label      VARCHAR(120) NOT NULL,
  url        VARCHAR(500) NOT NULL,                       -- e.g. /shop?material=Gold&type=Ring
  image      VARCHAR(255) NULL,                           -- featured banner in mega menu
  sort_order INT NOT NULL DEFAULT 0,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_mi_menu   FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
  CONSTRAINT fk_mi_parent FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  KEY idx_mi_menu (menu_id, parent_id, sort_order)
) ENGINE=InnoDB;

-- ============================================================================
-- MODULE 8 — SEO
-- ============================================================================

CREATE TABLE seo_meta (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type      VARCHAR(40) NOT NULL,                  -- product, category, collection, page
  entity_id        BIGINT UNSIGNED NOT NULL,
  meta_title       VARCHAR(200) NULL,
  meta_description VARCHAR(320) NULL,
  meta_keywords    VARCHAR(255) NULL,
  canonical_url    VARCHAR(255) NULL,
  og_image         VARCHAR(255) NULL,
  schema_json      TEXT NULL,                             -- JSON-LD
  UNIQUE KEY uq_seo_entity (entity_type, entity_id)
) ENGINE=InnoDB;

CREATE TABLE url_redirects (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  from_path   VARCHAR(255) NOT NULL UNIQUE,
  to_path     VARCHAR(255) NOT NULL,
  status_code SMALLINT UNSIGNED NOT NULL DEFAULT 301,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================================
-- MODULE 9 — ADMIN, ROLES & AUDIT
-- ============================================================================

CREATE TABLE roles (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE                        -- Super Admin, Manager, Staff
) ENGINE=InnoDB;

CREATE TABLE permissions (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(80) NOT NULL UNIQUE,                       -- products.edit, rates.update...
  name VARCHAR(120) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
  role_id       SMALLINT UNSIGNED NOT NULL,
  permission_id SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_perm FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id       SMALLINT UNSIGNED NOT NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_au_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_user_id INT UNSIGNED NULL,
  action       VARCHAR(60) NOT NULL,                      -- create, update, delete, login...
  entity_type  VARCHAR(60) NOT NULL,                      -- product, variant, metal_rate...
  entity_id    BIGINT UNSIGNED NULL,
  old_values   TEXT NULL,                                 -- JSON snapshot
  new_values   TEXT NULL,                                 -- JSON snapshot
  ip_address   VARCHAR(45) NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_al_admin FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  KEY idx_al_entity (entity_type, entity_id),
  KEY idx_al_admin (admin_user_id, created_at)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED DATA — lookup tables + menus (matches the storefront)
-- ============================================================================

INSERT INTO metals (name) VALUES ('Gold'), ('Platinum'), ('Silver');

INSERT INTO metal_purities (metal_id, name, purity_percent) VALUES
  (1,'24K',99.99),(1,'22K',91.60),(1,'21K',87.50),(1,'18K',75.00),(1,'14K',58.30),
  (2,'PT950',95.00),(3,'S925',92.50);

INSERT INTO metal_colors (name) VALUES ('Yellow Gold'), ('White Gold'), ('Rose Gold');

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Rings','rings',1),('Earrings','earrings',2),('Necklaces','necklaces',3),
  ('Pendants','pendants',4),('Bracelets','bracelets',5),('Bangles','bangles',6),
  ('Chains','chains',7),('Lockets','lockets',8),('Nose Pins','nose-pins',9),
  ('Bridal Sets','bridal-sets',10),('Traditional Jewellery','traditional-jewellery',11);

INSERT INTO collections (name, slug, sort_order) VALUES
  ('Royal Heritage','royal-heritage',1),('Classic','classic',2),('Minimal','minimal',3),
  ('Wedding','wedding',4),('Luxury','luxury',5),('Limited Edition','limited-edition',6);

INSERT INTO genders (name) VALUES ('Women'),('Men'),('Kids'),('Unisex');

INSERT INTO occasions (name, slug) VALUES
  ('Wedding','wedding'),('Engagement','engagement'),('Anniversary','anniversary'),
  ('Birthday','birthday'),('Festival','festival'),('Daily Wear','daily-wear');

INSERT INTO styles (name, slug) VALUES
  ('Solitaire','solitaire'),('Halo','halo'),('Cocktail','cocktail'),
  ('Color Stone','color-stone'),('Multi Stone','multi-stone'),('Single Stone','single-stone'),
  ('Vintage','vintage'),('Minimal','minimal'),('Designer','designer'),('Polki','polki');

INSERT INTO tags (name, slug) VALUES
  ('Trending','trending'),("Editor's Choice",'editors-choice'),
  ('Celebrity','celebrity'),('Luxury','luxury'),('Best Seller','best-seller');

INSERT INTO stone_types (name) VALUES
  ('Diamond'),('Ruby'),('Emerald'),('Sapphire'),('Pearl'),('Polki');

INSERT INTO stone_shapes (name) VALUES
  ('Round'),('Oval'),('Princess'),('Pear'),('Emerald'),('Heart'),('Cushion'),('Marquise');

INSERT INTO stone_colors (name) VALUES ('D'),('E'),('F'),('G'),('H'),('I'),('J');

INSERT INTO stone_clarities (name) VALUES
  ('IF'),('VVS1'),('VVS2'),('VS1'),('VS2'),('SI1'),('SI2');

INSERT INTO stone_cuts (name) VALUES ('Excellent'),('Very Good'),('Good');

INSERT INTO attributes (name, code, input_type, is_variant_level, is_filterable, sort_order) VALUES
  ('Ring Size','ring_size','select',1,1,1),
  ('Chain Length','chain_length','select',1,1,2),
  ('Bangle Size','bangle_size','select',1,1,3),
  ('Stone Count','stone_count','select',1,1,4),
  ('Nose Pin Type','nose_pin_type','select',1,1,5),
  ('Earring Closure','earring_closure','select',1,1,6);

INSERT INTO attribute_values (attribute_id, value, sort_order) VALUES
  (1,'5',1),(1,'6',2),(1,'7',3),(1,'8',4),(1,'9',5),
  (2,'16 inch',1),(2,'18 inch',2),(2,'20 inch',3),(2,'22 inch',4),
  (3,'2.4',1),(3,'2.6',2),(3,'2.8',3),
  (4,'1',1),(4,'3',2),(4,'5',3),(4,'7',4),(4,'13',5),(4,'25',6),
  (5,'Screw',1),(5,'Wire',2),
  (6,'Push Back',1),(6,'Screw Back',2),(6,'Hook',3);

INSERT INTO warehouses (name, type, address) VALUES
  ('Main Warehouse','warehouse','Dhaka'),
  ('Dhaka Boutique','store','Gulshan, Dhaka'),
  ('Chittagong Boutique','store','Chittagong');

INSERT INTO roles (name) VALUES ('Super Admin'),('Manager'),('Staff');

INSERT INTO permissions (code, name) VALUES
  ('products.manage','Manage products'),
  ('rates.update','Update metal rates'),
  ('inventory.adjust','Adjust inventory'),
  ('orders.manage','Manage orders'),
  ('discounts.approve','Approve discounts'),
  ('cms.manage','Manage CMS content'),
  ('admin.manage','Manage admin users');

INSERT INTO role_permissions (role_id, permission_id)
  SELECT 1, id FROM permissions;                          -- Super Admin: everything
INSERT INTO role_permissions (role_id, permission_id) VALUES
  (2,1),(2,3),(2,4),(2,6);                                -- Manager subset

INSERT INTO menus (name, code) VALUES
  ('Primary Navigation','primary'),
  ('Gold Mega Menu','gold_mega'),
  ('Diamond Mega Menu','diamond_mega'),
  ('Mobile Menu','mobile'),
  ('Footer Menu','footer');

-- Primary nav (matches the live storefront)
INSERT INTO menu_items (menu_id, label, url, sort_order) VALUES
  (1,'New Arrivals','/shop?sort=new',1),
  (1,'Gold','/shop?material=Gold',2),
  (1,'Diamond','/shop?material=Diamond',3),
  (1,'Bridal','/shop?occasion=Wedding,Engagement',4),
  (1,'Collections','/shop?collection=Luxury',5),
  (1,'Gifts','/shop?occasion=Anniversary,Festival',6),
  (1,'About','/#craft',7),
  (1,'Contact','/#appointment',8);

-- Gold mega menu: parents = column headings, children = links
INSERT INTO menu_items (menu_id, label, url, sort_order) VALUES
  (2,'Shop by Category','#',1),
  (2,'Shop by Purity','#',2),
  (2,'Shop by Gold Color','#',3),
  (2,'Shop by Recipient','#',4),
  (2,'Shop by Occasion','#',5),
  (2,'Shop by Price','#',6);
INSERT INTO menu_items (menu_id, parent_id, label, url, sort_order)
SELECT 2, p.id, c.label, c.url, c.so FROM menu_items p
JOIN (
  SELECT 'Shop by Category' h,'Rings' label,'/shop?material=Gold&type=Ring' url,1 so UNION ALL
  SELECT 'Shop by Category','Earrings','/shop?material=Gold&type=Earring',2 UNION ALL
  SELECT 'Shop by Category','Necklaces','/shop?material=Gold&type=Necklace',3 UNION ALL
  SELECT 'Shop by Category','Pendants','/shop?material=Gold&type=Pendant',4 UNION ALL
  SELECT 'Shop by Category','Bracelets','/shop?material=Gold&type=Bracelet',5 UNION ALL
  SELECT 'Shop by Category','Bangles','/shop?material=Gold&type=Bangle',6 UNION ALL
  SELECT 'Shop by Category','Chains','/shop?material=Gold&type=Chain',7 UNION ALL
  SELECT 'Shop by Category','Lockets','/shop?material=Gold&type=Locket',8 UNION ALL
  SELECT 'Shop by Category','Nose Pins','/shop?material=Gold&type=Nose+Pin',9 UNION ALL
  SELECT 'Shop by Category','Bridal Sets','/shop?material=Gold&occasion=Wedding',10 UNION ALL
  SELECT 'Shop by Category','Traditional Jewellery','/shop?material=Gold&style=Polki,Vintage',11 UNION ALL
  SELECT 'Shop by Purity','24K','/shop?material=Gold&purity=24K',1 UNION ALL
  SELECT 'Shop by Purity','22K','/shop?material=Gold&purity=22K',2 UNION ALL
  SELECT 'Shop by Purity','21K','/shop?material=Gold&purity=21K',3 UNION ALL
  SELECT 'Shop by Purity','18K','/shop?material=Gold&purity=18K',4 UNION ALL
  SELECT 'Shop by Purity','14K','/shop?material=Gold&purity=14K',5 UNION ALL
  SELECT 'Shop by Gold Color','Yellow Gold','/shop?material=Gold&color=Yellow+Gold',1 UNION ALL
  SELECT 'Shop by Gold Color','White Gold','/shop?material=Gold&color=White+Gold',2 UNION ALL
  SELECT 'Shop by Gold Color','Rose Gold','/shop?material=Gold&color=Rose+Gold',3 UNION ALL
  SELECT 'Shop by Recipient','Women','/shop?material=Gold&gender=Women',1 UNION ALL
  SELECT 'Shop by Recipient','Men','/shop?material=Gold&gender=Men',2 UNION ALL
  SELECT 'Shop by Recipient','Kids','/shop?material=Gold&gender=Kids',3 UNION ALL
  SELECT 'Shop by Occasion','Wedding','/shop?material=Gold&occasion=Wedding',1 UNION ALL
  SELECT 'Shop by Occasion','Engagement','/shop?material=Gold&occasion=Engagement',2 UNION ALL
  SELECT 'Shop by Occasion','Anniversary','/shop?material=Gold&occasion=Anniversary',3 UNION ALL
  SELECT 'Shop by Occasion','Festival','/shop?material=Gold&occasion=Festival',4 UNION ALL
  SELECT 'Shop by Price','Under ৳50,000','/shop?material=Gold&price=under-50k',1 UNION ALL
  SELECT 'Shop by Price','৳50K – ৳100K','/shop?material=Gold&price=50k-100k',2 UNION ALL
  SELECT 'Shop by Price','৳100K – ৳250K','/shop?material=Gold&price=100k-250k',3 UNION ALL
  SELECT 'Shop by Price','৳250K+','/shop?material=Gold&price=250k-plus',4
) c ON c.h = p.label
WHERE p.menu_id = 2 AND p.parent_id IS NULL;

-- Diamond mega menu
INSERT INTO menu_items (menu_id, label, url, sort_order) VALUES
  (3,'Shop by Category','#',1),
  (3,'Shop by Diamond Style','#',2),
  (3,'Shop by Recipient','#',3),
  (3,'Shop by Price','#',4),
  (3,'Shop by Collection','#',5);
INSERT INTO menu_items (menu_id, parent_id, label, url, sort_order)
SELECT 3, p.id, c.label, c.url, c.so FROM menu_items p
JOIN (
  SELECT 'Shop by Category' h,'Rings' label,'/shop?material=Diamond&type=Ring' url,1 so UNION ALL
  SELECT 'Shop by Category','Necklaces','/shop?material=Diamond&type=Necklace',2 UNION ALL
  SELECT 'Shop by Category','Bracelets','/shop?material=Diamond&type=Bracelet',3 UNION ALL
  SELECT 'Shop by Category','Earrings','/shop?material=Diamond&type=Earring',4 UNION ALL
  SELECT 'Shop by Category','Pendants','/shop?material=Diamond&type=Pendant',5 UNION ALL
  SELECT 'Shop by Category','Bangles','/shop?material=Diamond&type=Bangle',6 UNION ALL
  SELECT 'Shop by Category','Lockets','/shop?material=Diamond&type=Locket',7 UNION ALL
  SELECT 'Shop by Category','Chains','/shop?material=Diamond&type=Chain',8 UNION ALL
  SELECT 'Shop by Category','Nose Pins','/shop?material=Diamond&type=Nose+Pin',9 UNION ALL
  SELECT 'Shop by Diamond Style','Solitaire','/shop?material=Diamond&style=Solitaire',1 UNION ALL
  SELECT 'Shop by Diamond Style','Halo','/shop?material=Diamond&style=Halo',2 UNION ALL
  SELECT 'Shop by Diamond Style','Cocktail','/shop?material=Diamond&style=Cocktail',3 UNION ALL
  SELECT 'Shop by Diamond Style','Color Stone','/shop?material=Diamond&style=Color+Stone',4 UNION ALL
  SELECT 'Shop by Diamond Style','Designer','/shop?material=Diamond&style=Designer',5 UNION ALL
  SELECT 'Shop by Diamond Style','Polki','/shop?material=Diamond&style=Polki',6 UNION ALL
  SELECT 'Shop by Recipient','Women','/shop?material=Diamond&gender=Women',1 UNION ALL
  SELECT 'Shop by Recipient','Men','/shop?material=Diamond&gender=Men',2 UNION ALL
  SELECT 'Shop by Recipient','Kids','/shop?material=Diamond&gender=Kids',3 UNION ALL
  SELECT 'Shop by Price','Under ৳100K','/shop?material=Diamond&price=under-50k,50k-100k',1 UNION ALL
  SELECT 'Shop by Price','৳100K – ৳250K','/shop?material=Diamond&price=100k-250k',2 UNION ALL
  SELECT 'Shop by Price','৳250K+','/shop?material=Diamond&price=250k-plus',3 UNION ALL
  SELECT 'Shop by Collection','Royal Heritage','/shop?collection=Royal+Heritage',1 UNION ALL
  SELECT 'Shop by Collection','Luxury','/shop?collection=Luxury',2 UNION ALL
  SELECT 'Shop by Collection','Wedding','/shop?collection=Wedding',3 UNION ALL
  SELECT 'Shop by Collection','Minimal','/shop?collection=Minimal',4
) c ON c.h = p.label
WHERE p.menu_id = 3 AND p.parent_id IS NULL;

-- Today's example gold rates (per gram, BDT) — update via admin panel
INSERT INTO metal_rates (purity_id, rate_per_gram, effective_from) VALUES
  (1, 11500.00, NOW()),   -- 24K
  (2, 10550.00, NOW()),   -- 22K
  (3, 10050.00, NOW()),   -- 21K
  (4,  8650.00, NOW()),   -- 18K
  (5,  6700.00, NOW());   -- 14K

-- ============================================================================
-- MODULE — STOREFRONT ANALYTICS
-- Feeds the dashboard's Visitors / Product Views / Traffic Sources panels.
-- Written by /api/track on each storefront page view. No FKs on purpose: an
-- event must survive the product or user it referenced being deleted.
-- ============================================================================

CREATE TABLE analytics_events (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id      VARCHAR(64) NOT NULL,                    -- anonymous, cookie-scoped
  user_id         BIGINT UNSIGNED NULL,                    -- NULL = guest
  event           ENUM('page_view','product_view','add_to_cart') NOT NULL DEFAULT 'page_view',
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
