-- Phase 2/3: a real order, not just a phone-hold.
--
-- Checkout used to write a name, a phone and a free-text address, and every
-- other fact about the sale (what the piece was made of, what was charged for
-- making it, which coupon applied, how it was paid) was left to be re-derived
-- from the catalogue later. That breaks the moment a price, a purity or a
-- product name changes: the order would silently rewrite its own history.
--
-- An order is a SNAPSHOT. Everything it needs to be reprinted years later is
-- copied into it at the moment it is placed.

/* ── The sale ─────────────────────────────────────────────────────────── */

ALTER TABLE orders
  -- Where it goes. Kept as columns, not a join to `addresses`: the customer is
  -- free to edit or delete that address afterwards, and a delivered order must
  -- still say where it actually went.
  ADD COLUMN address_id        BIGINT UNSIGNED NULL AFTER user_id,
  ADD COLUMN shipping_label    VARCHAR(40)  NULL AFTER shipping_address,
  ADD COLUMN shipping_city     VARCHAR(80)  NULL AFTER shipping_label,
  ADD COLUMN shipping_district VARCHAR(80)  NULL AFTER shipping_city,
  ADD COLUMN shipping_postcode VARCHAR(20)  NULL AFTER shipping_district,
  ADD COLUMN shipping_country  CHAR(2)      NOT NULL DEFAULT 'BD' AFTER shipping_postcode,
  -- How it was paid.
  ADD COLUMN payment_method ENUM('cod','stripe','bkash','nagad','rocket','card') NOT NULL DEFAULT 'cod' AFTER grand_total,
  ADD COLUMN payment_status ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending' AFTER payment_method,
  -- What was charged, and why. discount_total/tax_total/grand_total already exist.
  ADD COLUMN coupon_code         VARCHAR(40)   NULL AFTER coupon_id,
  ADD COLUMN making_charge_total DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER subtotal,
  ADD COLUMN stone_charge_total  DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER making_charge_total,
  ADD COLUMN tax_rate            DECIMAL(5,2)  NOT NULL DEFAULT 0 AFTER tax_total,
  ADD COLUMN gift_message        VARCHAR(300)  NULL AFTER customer_note;

-- The jewellery pipeline. A ring is not "processing" — it is being cast,
-- hallmarked, set, polished and inspected, and the customer is told so.
ALTER TABLE orders
  MODIFY COLUMN status ENUM(
    'reserved','pending','confirmed','processing',
    'crafting','hallmarking','diamond_setting','polishing','quality_check','packed',
    'ready_to_ship','shipped','out_for_delivery','delivered',
    'cancelled','returned','refunded','expired'
  ) NOT NULL DEFAULT 'pending';

/* ── The line ─────────────────────────────────────────────────────────── */

-- The specification of the piece as it was sold. An admin editing the product
-- tomorrow (or deleting the variant) must not change what this invoice says.
ALTER TABLE order_items
  ADD COLUMN image_path         VARCHAR(255)  NULL AFTER variant_sku,
  ADD COLUMN metal              VARCHAR(30)   NULL AFTER image_path,
  ADD COLUMN purity             VARCHAR(10)   NULL AFTER metal,
  ADD COLUMN metal_color        VARCHAR(30)   NULL AFTER purity,
  ADD COLUMN size_label         VARCHAR(40)   NULL AFTER metal_color,
  ADD COLUMN metal_weight_g     DECIMAL(8,2)  NULL AFTER size_label,
  ADD COLUMN diamond_carat      DECIMAL(7,2)  NULL AFTER metal_weight_g,
  ADD COLUMN stone_count        INT UNSIGNED  NULL AFTER diamond_carat,
  ADD COLUMN certificate_no     VARCHAR(60)   NULL AFTER stone_count,
  ADD COLUMN certificate_issuer VARCHAR(30)   NULL AFTER certificate_no,
  ADD COLUMN making_charge      DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER certificate_issuer,
  ADD COLUMN stone_charge       DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER making_charge;
