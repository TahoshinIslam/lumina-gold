-- Only customer-SELECTABLE options become variants; measured dimensions stay
-- specifications.
--
-- Ring Size / Bangle Size / Length are choices a shopper makes, so each one is a
-- real purchasable variant with its own SKU, price and stock.
--
-- Height / Width / Thickness / Pin Length / Gauge are facts about the piece. A
-- shopper does not pick them, so making them variant axes would multiply SKUs
-- (a locket with 3 heights x 3 widths x 2 thicknesses = 18 SKUs of an item that
-- is only ever sold one way). They are recorded once per product and shown in
-- Specifications instead.

-- 1. Demote the dimensions out of the variant axis.
UPDATE attributes
   SET is_variant_level = 0,
       -- measured, not chosen from a list: "12.5 mm", "22G"
       input_type = 'text',
       is_filterable = 0
 WHERE code IN ('height', 'width', 'thickness', 'pin_length', 'gauge');

-- 2. A spec is one measured value per product — NOT an attribute_values option
--    row, which is a shared choice and would grow a junk option list (12mm,
--    12.1mm, 12.2mm...) and still leave every value selectable.
CREATE TABLE IF NOT EXISTS product_specifications (
  product_id   BIGINT UNSIGNED   NOT NULL,
  attribute_id SMALLINT UNSIGNED NOT NULL,
  value        VARCHAR(120)      NOT NULL,
  PRIMARY KEY (product_id, attribute_id),
  CONSTRAINT fk_prodspec_product   FOREIGN KEY (product_id)   REFERENCES products (id)   ON DELETE CASCADE,
  CONSTRAINT fk_prodspec_attribute FOREIGN KEY (attribute_id) REFERENCES attributes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
