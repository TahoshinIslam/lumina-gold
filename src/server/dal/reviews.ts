import { query } from '@/server/db/client';

/**
 * Reviews.
 *
 * Only a verified buyer may write one: a review row must carry the `order_id`
 * of a DELIVERED order containing that piece. That check lives in the action,
 * but it's why `order_id` is not nullable in practice — it is the proof.
 *
 * Moderation: a review is 'pending' until an admin approves it. The storefront
 * only ever reads 'approved', so nothing unmoderated is ever public.
 */

export interface ReviewMedia { id: number; path: string; kind: 'image' | 'video' }

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string | null;
  body: string | null;
  reply: string | null;
  replied_at: string | null;
  helpful_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  author: string;
  avatar_path: string | null;
  media: ReviewMedia[];
  /** Has the person reading it already found it helpful? */
  voted?: boolean;
}

export interface RatingSummary {
  average: number;
  count: number;
  /** 5 → n, 4 → n … so the bar chart can be drawn without a second query. */
  breakdown: Record<number, number>;
}

async function attachMedia(reviews: Review[], viewerId?: number): Promise<Review[]> {
  if (!reviews.length) return reviews;
  const ids = reviews.map(r => r.id);
  const holes = ids.map(() => '?').join(',');

  const [media, votes] = await Promise.all([
    query<ReviewMedia & { review_id: number }>(
      `SELECT id, review_id, path, kind FROM review_media
        WHERE review_id IN (${holes}) ORDER BY sort_order, id`,
      ids,
    ),
    viewerId
      ? query<{ review_id: number }>(
          `SELECT review_id FROM review_helpful WHERE user_id = ? AND review_id IN (${holes})`,
          [viewerId, ...ids],
        )
      : Promise.resolve([]),
  ]);

  const voted = new Set(votes.map(v => v.review_id));
  return reviews.map(review => ({
    ...review,
    helpful_count: Number(review.helpful_count),
    rating: Number(review.rating),
    media: media.filter(m => m.review_id === review.id).map(({ id, path, kind }) => ({ id, path, kind })),
    voted: voted.has(review.id),
  }));
}

const REVIEW_COLUMNS = `
  r.id, r.product_id, r.user_id, r.rating, r.title, r.body, r.reply, r.replied_at,
  r.helpful_count, r.status, r.created_at,
  u.name AS author, u.avatar_path`;

/** The approved reviews shown on a product page, most helpful first. */
export async function getProductReviews(productId: number, viewerId?: number): Promise<Review[]> {
  const rows = await query<Review>(
    `SELECT ${REVIEW_COLUMNS} FROM reviews r
       JOIN users u ON u.id = r.user_id
      WHERE r.product_id = ? AND r.status = 'approved'
      ORDER BY r.helpful_count DESC, r.created_at DESC
      LIMIT 50`,
    [productId],
  );
  return attachMedia(rows, viewerId);
}

/** Average and star breakdown — approved reviews only, so the number is honest. */
export async function getRatingSummary(productId: number): Promise<RatingSummary> {
  const rows = await query<{ rating: number; n: number }>(
    `SELECT rating, COUNT(*) n FROM reviews
      WHERE product_id = ? AND status = 'approved' GROUP BY rating`,
    [productId],
  );
  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;
  let sum = 0;
  for (const row of rows) {
    const stars = Number(row.rating);
    const n = Number(row.n);
    breakdown[stars] = n;
    total += n;
    sum += stars * n;
  }
  return { average: total ? Math.round((sum / total) * 10) / 10 : 0, count: total, breakdown };
}

/** This customer's own review of a piece — pending or rejected ones included. */
export async function getMyReview(productId: number, userId: number): Promise<Review | null> {
  const rows = await query<Review>(
    `SELECT ${REVIEW_COLUMNS} FROM reviews r
       JOIN users u ON u.id = r.user_id
      WHERE r.product_id = ? AND r.user_id = ?`,
    [productId, userId],
  );
  if (!rows[0]) return null;
  return (await attachMedia(rows, userId))[0];
}

/** Everything this customer has written — the Reviews tab of their account. */
export async function getMyReviews(userId: number): Promise<(Review & { product_name: string; product_slug: string })[]> {
  const rows = await query<Review & { product_name: string; product_slug: string }>(
    `SELECT ${REVIEW_COLUMNS}, p.name AS product_name, p.slug AS product_slug
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN products p ON p.id = r.product_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC`,
    [userId],
  );
  return (await attachMedia(rows, userId)) as (Review & { product_name: string; product_slug: string })[];
}

/**
 * May this customer review this piece? Only if they have actually received it.
 * Returns the delivered order that proves it — that id is stored on the review.
 */
export async function purchasedOrder(productId: number, userId: number): Promise<number | null> {
  const rows = await query<{ id: number }>(
    `SELECT o.id FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN product_variants v ON v.id = oi.variant_id
      WHERE o.user_id = ? AND v.product_id = ? AND o.status = 'delivered'
      ORDER BY o.placed_at DESC LIMIT 1`,
    [userId, productId],
  );
  return rows[0]?.id ?? null;
}

/** Pieces this customer has received but not yet reviewed — the nudge on their account. */
export async function awaitingReview(userId: number): Promise<{ id: number; name: string; slug: string; image: string | null }[]> {
  return query(
    `SELECT DISTINCT p.id, p.name, p.slug,
            (SELECT pi.image_path FROM product_images pi
              WHERE pi.product_id = p.id ORDER BY pi.is_primary DESC, pi.sort_order LIMIT 1) AS image
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN product_variants v ON v.id = oi.variant_id
       JOIN products p ON p.id = v.product_id
      WHERE o.user_id = ? AND o.status = 'delivered'
        AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.product_id = p.id AND r.user_id = o.user_id)
      LIMIT 8`,
    [userId],
  );
}

/* ── Admin (Phase 11) ─────────────────────────────────────────────────── */

export interface AdminReviewFilters {
  search?: string;
  rating?: string;
  status?: string;
  /** 'verified' | 'unverified' — a review is verified iff it carries a delivered order's id. */
  verified?: string;
  page?: number;
  perPage?: number;
}

export interface AdminReview extends Review {
  product_name: string;
  product_slug: string;
  author_email: string | null;
  verified: number;
}

export async function listReviewsForAdmin(filters: AdminReviewFilters = {}) {
  const perPage = filters.perPage ?? 20;
  const page = Math.max(1, filters.page ?? 1);

  const where: string[] = ['1 = 1'];
  const params: (string | number)[] = [];

  if (filters.status && filters.status !== 'all') {
    where.push('r.status = ?');
    params.push(filters.status);
  }
  if (filters.rating && filters.rating !== 'all') {
    where.push('r.rating = ?');
    params.push(Number(filters.rating));
  }
  if (filters.verified === 'verified') where.push('r.order_id IS NOT NULL');
  if (filters.verified === 'unverified') where.push('r.order_id IS NULL');
  if (filters.search?.trim()) {
    where.push('(r.title LIKE ? OR r.body LIKE ? OR p.name LIKE ? OR u.name LIKE ?)');
    const like = `%${filters.search.trim()}%`;
    params.push(like, like, like, like);
  }
  const clause = where.join(' AND ');

  const counted = await query<{ n: number }>(
    `SELECT COUNT(*) n FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN products p ON p.id = r.product_id
      WHERE ${clause}`,
    params,
  );
  const total = Number(counted[0]?.n ?? 0);
  const pages = Math.max(1, Math.ceil(total / perPage));
  const offset = (Math.min(page, pages) - 1) * perPage;

  const rows = await query<AdminReview>(
    `SELECT ${REVIEW_COLUMNS}, p.name AS product_name, p.slug AS product_slug,
            u.email AS author_email,
            (r.order_id IS NOT NULL) AS verified
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN products p ON p.id = r.product_id
      WHERE ${clause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );
  const reviews = (await attachMedia(rows)) as AdminReview[];
  return { reviews, total, page: Math.min(page, pages), pages };
}

/** The numbers on the admin Reviews page. */
export async function reviewMetrics() {
  const [avg, byStatus, mostReviewed] = await Promise.all([
    query<{ average: number | null; n: number }>(
      `SELECT AVG(rating) average, COUNT(*) n FROM reviews WHERE status = 'approved'`,
    ),
    query<{ status: string; n: number }>('SELECT status, COUNT(*) n FROM reviews GROUP BY status'),
    query<{ name: string; slug: string; n: number; average: number }>(
      `SELECT p.name, p.slug, COUNT(*) n, AVG(r.rating) average
         FROM reviews r JOIN products p ON p.id = r.product_id
        WHERE r.status = 'approved'
        GROUP BY p.id ORDER BY n DESC, average DESC LIMIT 5`,
    ),
  ]);
  const counts: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
  for (const row of byStatus) counts[row.status] = Number(row.n);
  return {
    average: avg[0]?.average ? Math.round(Number(avg[0].average) * 10) / 10 : 0,
    approved: Number(avg[0]?.n ?? 0),
    counts,
    mostReviewed: mostReviewed.map(m => ({ ...m, n: Number(m.n), average: Math.round(Number(m.average) * 10) / 10 })),
  };
}
