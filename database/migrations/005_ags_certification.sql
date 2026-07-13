-- ============================================================================
-- 005 — AGS certification
--
-- Diamond Information (Add Product page) offers Certification as
-- GIA / IGI / HRD / SGL / AGS / Other. AGS (American Gem Society) wasn't in
-- the original `certificates.issuer` enum — add it.
--
-- Apply:  mysql -u root lumina_jewelry < database/migrations/005_ags_certification.sql
-- ============================================================================

ALTER TABLE certificates
  MODIFY COLUMN issuer ENUM('GIA','IGI','HRD','SGL','AGS','Other') NOT NULL DEFAULT 'Other';
