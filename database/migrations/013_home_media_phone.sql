-- A phone crop for the two backdrops (the landing photograph and The Editorial).
--
-- Those two are painted as the VIEWPORT itself (position: fixed, inset 0, cover),
-- and a phone's viewport is about 9:19. A 16:9 photograph covering that keeps
-- only the middle quarter of its width, so the piece the shot was composed around
-- ends up outside the frame, blown up.
--
-- The upload now derives an upright crop from the same photograph — chosen by
-- salience, not by blindly taking the middle — and keeps it here alongside the
-- wide one. Nothing else in the row changes, and a section that has no phone crop
-- (every gallery section) simply leaves this NULL and behaves as it always has.

ALTER TABLE home_media
  ADD COLUMN image_phone VARCHAR(255) NULL AFTER image;
