-- Testimonials — "In Their Words / Cherished by Collectors" on the landing page.
--
-- The table has existed since the first schema and NOTHING has ever read or
-- written it: the quotes on the home page were a hardcoded array in
-- src/components/brand/data.ts, so the admin could not add, edit or remove a
-- single one of them.
--
-- This seeds the five quotes the page has been showing all along, so turning the
-- section over to the database changes nothing on screen — and from now on it is
-- editable under Admin → Testimonials.
--
-- `author_title` carries the city, which is what the card actually prints under
-- the name.

INSERT INTO testimonials (author_name, author_title, quote, sort_order, is_active)
SELECT * FROM (
  SELECT 'A. de Villiers' AS author_name, 'Genève' AS author_title,
         'The rivière necklace I commissioned took eight months. When it arrived, my wife wept. Nothing we own compares to it.' AS quote,
         1 AS sort_order, 1 AS is_active
  UNION ALL SELECT 'M. Hartwell', 'New York',
    'Their private salon experience is unlike anything in Paris. Three generations of my family now wear Nahar Jewellers.', 2, 1
  UNION ALL SELECT 'S. Al-Rashid', 'Paris',
    'I have collected high jewelry for twenty years. Nahar Jewellers'' gold work is the finest I have ever held.', 3, 1
  UNION ALL SELECT 'N. Rahman', 'Dhaka',
    'From the first sketch to the final polish, they treated my mother''s heirloom stones with reverence. The reset bangles are breathtaking.', 4, 1
  UNION ALL SELECT 'E. Whitmore', 'London',
    'The engagement ring was ready before the promised date, with a certificate for every stone. Service as flawless as the diamond.', 5, 1
) AS seed
-- Idempotent: re-running this migration must not duplicate the quotes.
WHERE NOT EXISTS (SELECT 1 FROM testimonials);
