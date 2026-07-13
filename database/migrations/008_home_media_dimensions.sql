-- Remember the shape of each home page photograph.
--
-- 007 resized uploads to a fixed frame with fit:cover, which centre-CROPPED
-- anything that wasn't already 3:4.1 (or 4:5) — heads and edges were being cut
-- off. Uploads now keep their own proportions, so the page has to know them in
-- order to give each photo a frame that fits it instead of trimming it.

ALTER TABLE home_media
  ADD COLUMN width  SMALLINT UNSIGNED NULL AFTER image,
  ADD COLUMN height SMALLINT UNSIGNED NULL AFTER width;
