import { query } from '@/server/db/client';

/**
 * Testimonials — the "In Their Words / Cherished by Collectors" carousel.
 *
 * The table shipped with the first schema and nothing ever read it: the quotes
 * were a hardcoded array in a component, so the boutique could not add a real
 * client's words or take down one it no longer wanted to show. This is the read
 * side that was missing.
 */

export interface Testimonial {
  id: number;
  author_name: string;
  /** The city, which is what the card prints under the name. */
  author_title: string | null;
  quote: string;
  sort_order: number;
  is_active: number;
}

/** What the landing page shows: the active ones, in the admin's order. */
export async function getTestimonials(): Promise<Testimonial[]> {
  return query<Testimonial>(
    `SELECT id, author_name, author_title, quote, sort_order, is_active
       FROM testimonials
      WHERE is_active = 1
      ORDER BY sort_order, id`,
  );
}

/** Everything, including the hidden ones — the admin list. */
export async function listTestimonials(): Promise<Testimonial[]> {
  return query<Testimonial>(
    `SELECT id, author_name, author_title, quote, sort_order, is_active
       FROM testimonials
      ORDER BY sort_order, id`,
  );
}

export async function getTestimonial(id: number): Promise<Testimonial | null> {
  const rows = await query<Testimonial>(
    `SELECT id, author_name, author_title, quote, sort_order, is_active
       FROM testimonials WHERE id = ?`,
    [id],
  );
  return rows[0] ?? null;
}
