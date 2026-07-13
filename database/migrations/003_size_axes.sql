-- Size axes per category (see src/config/sizes.ts).
--
-- ring_size, bangle_size and chain_length already exist and are left alone —
-- their values are in use. chain_length is only RENAMED, because it is now the
-- shared "Length" axis for Chains, Necklaces and Sitahar rather than chains
-- only; its `code` is unchanged, so nothing that reads it breaks.
--
-- INSERT IGNORE on a UNIQUE `code`, so re-running this is a no-op.

UPDATE attributes SET name = 'Length' WHERE code = 'chain_length';

INSERT IGNORE INTO attributes (name, code, input_type, is_variant_level, is_filterable, sort_order) VALUES
  ('Height',     'height',     'select', 1, 1, 7),
  ('Width',      'width',      'select', 1, 1, 8),
  ('Thickness',  'thickness',  'select', 1, 1, 9),
  ('Pin Length', 'pin_length', 'select', 1, 1, 10),
  ('Gauge',      'gauge',      'select', 1, 1, 11);
