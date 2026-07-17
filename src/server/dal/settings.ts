import { unstable_cache } from 'next/cache';
import { query, db } from '@/server/db/client';

/**
 * Site settings — a key/value store (see migrations/017_settings.sql). First use
 * is the storefront's social links, editable from /admin/settings instead of
 * living hardcoded in the header.
 */

export const SETTINGS_TAG = 'settings';

export type SocialLinks = { facebook: string; instagram: string; x: string; youtube: string };
const EMPTY_SOCIAL: SocialLinks = { facebook: '', instagram: '', x: '', youtube: '' };

const SOCIAL_KEYS = {
  facebook: 'social_facebook',
  instagram: 'social_instagram',
  x: 'social_x',
  youtube: 'social_youtube',
} as const;

/**
 * The social links, cached and tagged so a save from the admin invalidates it
 * everywhere at once. Resilient by design: this is read from the ROOT layout on
 * every page, so a DB hiccup or a not-yet-migrated table must degrade to "no
 * icons", never throw and take the whole site down.
 */
export const getSocialLinks = unstable_cache(
  async (): Promise<SocialLinks> => {
    try {
      const rows = await query<{ key: string; value: string | null }>(
        `SELECT \`key\`, \`value\` FROM settings WHERE \`key\` IN (?, ?, ?, ?)`,
        Object.values(SOCIAL_KEYS),
      );
      const map = new Map(rows.map(r => [r.key, r.value ?? '']));
      return {
        facebook: map.get(SOCIAL_KEYS.facebook) ?? '',
        instagram: map.get(SOCIAL_KEYS.instagram) ?? '',
        x: map.get(SOCIAL_KEYS.x) ?? '',
        youtube: map.get(SOCIAL_KEYS.youtube) ?? '',
      };
    } catch {
      return EMPTY_SOCIAL;
    }
  },
  ['social-links'],
  { tags: [SETTINGS_TAG] },
);

/** Upsert the four social links. Empty string is a valid value — it clears an
 *  icon rather than leaving the old one. */
export async function saveSocialLinks(links: SocialLinks): Promise<void> {
  for (const [field, key] of Object.entries(SOCIAL_KEYS) as [keyof SocialLinks, string][]) {
    await db.query(
      `INSERT INTO settings (\`key\`, \`value\`) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
      [key, links[field].trim()],
    );
  }
}
