import { query } from '@/server/db/client';
import type { Product } from '@/types/product';
import { getProductsBySkus } from '@/server/dal/catalog';

/**
 * Campaigns — a titled, dated selection of pieces (an Eid sale, a bridal edit).
 *
 * The admin has been able to create these since the beginning: title, dates,
 * section, a "feature on the home page" flag and a list of products. NOTHING
 * ever rendered them. This is the read side that was missing — a campaign is
 * live only when it is published AND today falls inside its window, so an admin
 * can prepare next month's sale without it appearing tonight.
 */

export interface Campaign {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  section: string | null;
  start_at: string | null;
  end_at: string | null;
  product_count: number;
}

export interface CampaignWithProducts extends Campaign {
  products: Product[];
}

const LIVE = `
  c.is_published = 1
  AND (c.start_at IS NULL OR c.start_at <= NOW())
  AND (c.end_at IS NULL OR c.end_at >= NOW())`;

const COLUMNS = `
  c.id, c.title, c.slug, c.description, c.section, c.start_at, c.end_at,
  (SELECT COUNT(*) FROM campaign_products cp WHERE cp.campaign_id = c.id) AS product_count`;

/** Every campaign running right now. */
export async function getLiveCampaigns(): Promise<Campaign[]> {
  return query<Campaign>(
    `SELECT ${COLUMNS} FROM campaigns c WHERE ${LIVE} ORDER BY c.start_at DESC, c.id DESC`,
  );
}

/** The one the admin ticked "feature on the home page" — the newest, if several. */
export async function getFeaturedCampaign(): Promise<CampaignWithProducts | null> {
  const rows = await query<Campaign>(
    `SELECT ${COLUMNS} FROM campaigns c
      WHERE ${LIVE} AND c.is_home_featured = 1
      ORDER BY c.start_at DESC, c.id DESC LIMIT 1`,
  );
  const campaign = rows[0];
  if (!campaign) return null;

  const products = await getCampaignProducts(campaign.id, 4);
  // A campaign with nothing in it is a headline with no offer behind it — the
  // home page is better off saying nothing.
  if (!products.length) return null;

  return { ...campaign, products };
}

export async function getCampaign(slug: string): Promise<CampaignWithProducts | null> {
  const rows = await query<Campaign>(
    `SELECT ${COLUMNS} FROM campaigns c WHERE c.slug = ? AND ${LIVE}`, [slug],
  );
  const campaign = rows[0];
  if (!campaign) return null;
  return { ...campaign, products: await getCampaignProducts(campaign.id) };
}

/**
 * The pieces in a campaign, priced the way the rest of the shop prices them —
 * through getProductsBySkus, so a rate-based piece inside a campaign still
 * follows the gold rate. A campaign is a SELECTION of products, never a second
 * place where prices are decided.
 */
async function getCampaignProducts(campaignId: number, limit = 24): Promise<Product[]> {
  const rows = await query<{ sku: string }>(
    `SELECT p.sku
       FROM campaign_products cp
       JOIN products p ON p.id = cp.product_id
      WHERE cp.campaign_id = ? AND p.status = 'active'
      -- campaign_products is a pivot keyed on (campaign_id, product_id): it has
      -- no id, and ordering by one threw, taking the whole home page down with it.
      ORDER BY cp.sort_order, p.id
      LIMIT ?`,
    [campaignId, limit],
  );
  if (!rows.length) return [];
  return getProductsBySkus(rows.map(r => r.sku));
}
