'use server';

import { revalidatePath } from 'next/cache';
import { unlink } from 'fs/promises';
import path from 'path';
import { db, query } from '@/server/db/client';
import { getCurrentCustomer } from '@/server/auth/customer';
import { purchasedOrder } from '@/server/dal/reviews';

export type ReviewResult = { ok: boolean; message: string };

/**
 * Write or update a review.
 *
 * VERIFIED BUYERS ONLY: the customer must have a DELIVERED order containing the
 * piece, and that order's id is stored on the review — it is the proof, not a
 * flag someone can set. A review lands as 'pending' and only becomes public when
 * an admin approves it, so nothing unmoderated is ever on the storefront.
 *
 * Editing an approved review sends it back to 'pending': otherwise a five-star
 * review could be approved and then quietly rewritten into anything at all.
 */
export async function saveReviewAction(formData: FormData): Promise<ReviewResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in to review this piece.' };

  const productId = Number(formData.get('product_id'));
  const rating = Number(formData.get('rating'));
  const title = String(formData.get('title') || '').trim().slice(0, 150);
  const body = String(formData.get('body') || '').trim().slice(0, 4000);
  // Paths already uploaded through /api/reviews/upload, which is what validated them.
  const media = formData.getAll('media').map(String).filter(Boolean).slice(0, 6);

  if (!productId) return { ok: false, message: 'Unknown piece.' };
  if (!(rating >= 1 && rating <= 5)) return { ok: false, message: 'Choose a rating from 1 to 5 stars.' };
  if (body.length < 4) return { ok: false, message: 'Tell other shoppers a little about the piece.' };

  const orderId = await purchasedOrder(productId, customer.id);
  if (!orderId) {
    return { ok: false, message: 'Only customers who have received this piece can review it.' };
  }

  const existing = await query<{ id: number }>(
    'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?', [productId, customer.id],
  );

  let reviewId: number;
  if (existing[0]) {
    reviewId = existing[0].id;
    await query(
      `UPDATE reviews SET rating = ?, title = ?, body = ?, order_id = ?, status = 'pending'
        WHERE id = ?`,
      [rating, title || null, body, orderId, reviewId],
    );
  } else {
    const [res] = await db.query(
      `INSERT INTO reviews (product_id, user_id, order_id, rating, title, body, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [productId, customer.id, orderId, rating, title || null, body],
    );
    reviewId = (res as { insertId: number }).insertId;
  }

  // The submitted list IS the gallery — anything the customer removed goes.
  const old = await query<{ id: number; path: string }>(
    'SELECT id, path FROM review_media WHERE review_id = ?', [reviewId],
  );
  const kept = new Set(media);
  for (const file of old) {
    if (kept.has(file.path)) continue;
    await query('DELETE FROM review_media WHERE id = ?', [file.id]);
    await unlink(path.join(process.cwd(), 'public', file.path.replace(/^\/+/, ''))).catch(() => {});
  }
  const existingPaths = new Set(old.map(o => o.path));
  let order = 0;
  for (const item of media) {
    order += 1;
    if (existingPaths.has(item)) continue;
    await query(
      'INSERT INTO review_media (review_id, path, kind, sort_order) VALUES (?, ?, ?, ?)',
      [reviewId, item, /\.(mp4|webm|mov)$/i.test(item) ? 'video' : 'image', order],
    );
  }

  revalidatePath('/admin/reviews');
  revalidatePath('/account');
  return { ok: true, message: 'Thank you — your review is with our team and appears once approved.' };
}

export async function deleteReviewAction(formData: FormData): Promise<ReviewResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };

  const id = Number(formData.get('id'));
  const rows = await query<{ id: number; product_id: number }>(
    'SELECT id, product_id FROM reviews WHERE id = ? AND user_id = ?', [id, customer.id],
  );
  if (!rows[0]) return { ok: false, message: 'Review not found.' };

  const media = await query<{ path: string }>('SELECT path FROM review_media WHERE review_id = ?', [id]);
  await query('DELETE FROM reviews WHERE id = ?', [id]); // media + votes cascade
  for (const file of media) {
    await unlink(path.join(process.cwd(), 'public', file.path.replace(/^\/+/, ''))).catch(() => {});
  }

  revalidatePath('/admin/reviews');
  revalidatePath('/account');
  return { ok: true, message: 'Your review has been removed.' };
}

/**
 * "Helpful" — one vote per person, ever.
 *
 * The count is derived from the votes table rather than incremented blindly:
 * a ++ on every click makes the number a lie the first time someone
 * double-clicks. Clicking again takes the vote back.
 */
export async function toggleHelpfulAction(formData: FormData): Promise<ReviewResult & { voted?: boolean; count?: number }> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Sign in to mark a review as helpful.' };

  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Unknown review.' };

  const voted = await query<{ user_id: number }>(
    'SELECT user_id FROM review_helpful WHERE review_id = ? AND user_id = ?', [id, customer.id],
  );

  if (voted[0]) {
    await query('DELETE FROM review_helpful WHERE review_id = ? AND user_id = ?', [id, customer.id]);
  } else {
    await query('INSERT IGNORE INTO review_helpful (review_id, user_id) VALUES (?, ?)', [id, customer.id]);
  }

  const counted = await query<{ n: number }>(
    'SELECT COUNT(*) n FROM review_helpful WHERE review_id = ?', [id],
  );
  const count = Number(counted[0]?.n ?? 0);
  await query('UPDATE reviews SET helpful_count = ? WHERE id = ?', [count, id]);

  return { ok: true, message: '', voted: !voted[0], count };
}
