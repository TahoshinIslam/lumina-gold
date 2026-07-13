'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/server/db/client';
import { getCurrentCustomer } from '@/server/auth/customer';

export type CommentResult = { ok: boolean; message: string };

/**
 * Comment on an article. Signed-in customers only — the account is the identity,
 * which is what makes a name under a comment mean anything.
 *
 * Published immediately, unlike a product review: a comment is a conversation,
 * and a boutique that answers a week late isn't in one. The admin can hide or
 * delete anything (see moderateCommentAction).
 */
export async function addCommentAction(formData: FormData): Promise<CommentResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in to join the conversation.' };

  const slug = String(formData.get('slug') || '');
  const body = String(formData.get('body') || '').trim().slice(0, 2000);
  if (body.length < 2) return { ok: false, message: 'Say a little more than that.' };

  // The article must exist AND be published — a draft has no comments section,
  // and the slug came from the client.
  const rows = await query<{ id: number }>(
    `SELECT id FROM blogs
      WHERE slug = ? AND status = 'published' AND (published_at IS NULL OR published_at <= NOW())`,
    [slug],
  );
  if (!rows[0]) return { ok: false, message: 'That article is no longer available.' };

  await query(
    'INSERT INTO blog_comments (blog_id, user_id, body) VALUES (?, ?, ?)',
    [rows[0].id, customer.id, body],
  );

  revalidatePath(`/journal/${slug}`);
  revalidatePath('/admin/journal');
  return { ok: true, message: 'Posted' };
}

/** A customer may delete their OWN comment, and only their own. */
export async function deleteCommentAction(formData: FormData): Promise<CommentResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };

  const id = Number(formData.get('id'));
  const slug = String(formData.get('slug') || '');
  if (!id) return { ok: false, message: 'Nothing to remove.' };

  // Ownership is in the WHERE clause — never "fetch, then check".
  await query('DELETE FROM blog_comments WHERE id = ? AND user_id = ?', [id, customer.id]);

  revalidatePath(`/journal/${slug}`);
  revalidatePath('/admin/journal');
  return { ok: true, message: 'Comment removed' };
}
