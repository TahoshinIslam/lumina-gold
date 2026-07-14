-- 014_inventory_integrity.sql
--
-- Overselling prevention, unique serials, and audit completeness.
--
-- The stock ledger (inventory, inventory_movements, inventory_reservations)
-- already existed; this migration adds the two things it was missing — a way to
-- track an INDIVIDUAL physical piece by serial, and the order-line column that
-- records which serial was sold — and a couple of indexes the new hot paths
-- (the atomic decrement and the expired-hold sweep) lean on.
--
-- The atomicity fix itself is in code (a conditional UPDATE), not here: it needs
-- no schema change, only the discipline to stop flooring stock at zero.

-- ── Serial numbers ───────────────────────────────────────────────────────────
-- One row per physical piece. Fine jewellery is largely one-of-a-kind, so a
-- variant with quantity_available = 3 can now be three DISTINCT rings, each with
-- its own hallmark/serial, each sellable exactly once.
--
-- This is a CAPABILITY, not a requirement: a variant with no rows here behaves
-- exactly as before (quantity_available is the only gate). A variant WITH serial
-- rows gets a second guarantee — the same physical piece cannot leave twice,
-- because claiming it flips status under a UNIQUE constraint.
CREATE TABLE IF NOT EXISTS `product_serials` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint(20) unsigned NOT NULL,
  `serial_number` varchar(80) NOT NULL,
  `status` enum('in_stock','reserved','sold','returned','damaged') NOT NULL DEFAULT 'in_stock',
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  -- A serial is globally unique: two pieces cannot share a hallmark, and the
  -- same piece cannot be entered twice.
  UNIQUE KEY `uq_serial` (`serial_number`),
  -- "the next in_stock piece for this variant" — the claim query's index.
  KEY `idx_serial_variant_status` (`variant_id`, `status`),
  KEY `fk_serial_order` (`order_id`),
  CONSTRAINT `fk_serial_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_serial_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Which serial shipped on which line, snapshotted onto the order like everything
-- else there — so the invoice still names the exact piece after the serial row
-- is edited or the variant retired.
ALTER TABLE `order_items`
  ADD COLUMN `serial_number` varchar(80) DEFAULT NULL AFTER `variant_sku`;

-- ── Indexes for the new hot paths ────────────────────────────────────────────
-- The atomic decrement filters inventory on (variant_id, warehouse_id) — already
-- the primary key, so it is covered. The expired-hold sweep filters orders on
-- (status, reserved_until); without this it is a full table scan every sweep.
ALTER TABLE `orders`
  ADD KEY `idx_orders_reserved` (`status`, `reserved_until`);
