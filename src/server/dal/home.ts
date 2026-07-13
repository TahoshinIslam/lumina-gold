import { query } from '@/server/db/client';
import { HOME_SECTIONS, HomeSectionKey } from '@/config/home';

/**
 * Everything the landing page and /categories read that an admin can change:
 * the category tiles and the editorial image galleries. Both used to be
 * hardcoded arrays in components, which is why nothing an admin did ever
 * showed up on the storefront.
 */

export interface CategoryTile {
  name: string;
  slug: string;
  image: string | null;
  product_count: number;
}

/**
 * Categories that actually have something to sell. A tile leading to
 * "0 creations" is a dead end, so empty categories are hidden rather than
 * shown greyed out.
 */
export async function getCategoryTiles(): Promise<CategoryTile[]> {
  return query<CategoryTile>(
    `SELECT c.name, c.slug, c.image,
            COUNT(DISTINCT p.id) AS product_count
       FROM categories c
       LEFT JOIN product_categories pc ON pc.category_id = c.id
       LEFT JOIN products p ON p.id = pc.product_id AND p.status = 'active'
      WHERE c.is_active = 1
      GROUP BY c.id
     HAVING product_count > 0
      ORDER BY c.sort_order, c.name`,
  );
}

export interface HomeMediaItem {
  id: number;
  section: HomeSectionKey;
  image: string;
  /** The photo's own proportions — uploads are never cropped, so the page frames them. */
  width: number | null;
  height: number | null;
  alt: string | null;
  sort_order: number;
}

/** What MediaSlideshow renders: a photo, and the shape to give its frame. */
export interface SlideImage {
  src: string;
  width?: number | null;
  height?: number | null;
}

export type HomeMedia = Record<HomeSectionKey, HomeMediaItem[]>;

/** All uploaded home imagery, grouped by section (empty arrays, never missing keys). */
export async function getHomeMedia(): Promise<HomeMedia> {
  const rows = await query<HomeMediaItem>(
    `SELECT id, section, image, width, height, alt, sort_order FROM home_media
      ORDER BY sort_order, id`,
  );
  const grouped = Object.fromEntries(
    HOME_SECTIONS.map(s => [s.key, [] as HomeMediaItem[]]),
  ) as HomeMedia;
  for (const row of rows) {
    // A section that was renamed/removed in config shouldn't crash the page.
    if (grouped[row.section]) grouped[row.section].push(row);
  }
  return grouped;
}

/**
 * The image list a section renders — uploads if there are any, otherwise its
 * shipped stills. The stills carry no dimensions, so those frames keep their
 * original CSS aspect-ratio.
 */
export function sectionImages(media: HomeMedia, key: HomeSectionKey): SlideImage[] {
  const uploaded = media[key] ?? [];
  if (uploaded.length) {
    return uploaded.map(m => ({ src: m.image, width: m.width, height: m.height }));
  }
  const fallback = HOME_SECTIONS.find(s => s.key === key)?.fallback ?? [];
  return fallback.map(src => ({ src }));
}
