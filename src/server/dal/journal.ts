import { query } from '@/server/db/client';

/**
 * The Journal — the boutique's articles, and the comments underneath them.
 *
 * The storefront only ever reads `status = 'published'` and a `published_at` in
 * the past, so an article can be written today and dated for next week without
 * a scheduler: it simply isn't visible until its own date arrives.
 */

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  tag: string | null;
  read_minutes: number;
  status: 'draft' | 'published';
  published_at: string | null;
  comment_count?: number;
}

export interface Comment {
  id: number;
  blog_id: number;
  user_id: number;
  body: string;
  created_at: string;
  author: string;
  avatar_path: string | null;
}

const LIVE = `b.status = 'published' AND (b.published_at IS NULL OR b.published_at <= NOW())`;

/** The Journal index, newest first. */
export async function getArticles(limit = 24): Promise<Article[]> {
  return query<Article>(
    `SELECT b.id, b.title, b.slug, b.excerpt, '' AS body, b.cover_image, b.tag,
            b.read_minutes, b.status, b.published_at,
            (SELECT COUNT(*) FROM blog_comments c
              WHERE c.blog_id = b.id AND c.status = 'visible') AS comment_count
       FROM blogs b
      WHERE ${LIVE}
      ORDER BY b.published_at DESC, b.id DESC
      LIMIT ?`,
    [limit],
  );
}

/** The three on the home page. */
export function getLatestArticles(limit = 3): Promise<Article[]> {
  return getArticles(limit);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const rows = await query<Article>(
    `SELECT b.id, b.title, b.slug, b.excerpt, b.body, b.cover_image, b.tag,
            b.read_minutes, b.status, b.published_at
       FROM blogs b
      WHERE b.slug = ? AND ${LIVE}`,
    [slug],
  );
  return rows[0] ?? null;
}

/** What else to read. Prefers the same tag, then falls back to the newest. */
export async function getRelatedArticles(article: Article, limit = 2): Promise<Article[]> {
  return query<Article>(
    `SELECT b.id, b.title, b.slug, b.excerpt, '' AS body, b.cover_image, b.tag,
            b.read_minutes, b.status, b.published_at
       FROM blogs b
      WHERE ${LIVE} AND b.id <> ?
      ORDER BY (b.tag <=> ?) DESC, b.published_at DESC
      LIMIT ?`,
    [article.id, article.tag, limit],
  );
}

export async function getComments(blogId: number): Promise<Comment[]> {
  return query<Comment>(
    `SELECT c.id, c.blog_id, c.user_id, c.body, c.created_at,
            u.name AS author, u.avatar_path
       FROM blog_comments c
       JOIN users u ON u.id = c.user_id
      WHERE c.blog_id = ? AND c.status = 'visible'
      ORDER BY c.created_at DESC`,
    [blogId],
  );
}

/* ── Admin ────────────────────────────────────────────────────────────── */

export interface AdminArticle extends Article {
  comment_count: number;
  created_at: string;
}

export async function listArticlesForAdmin(search?: string): Promise<AdminArticle[]> {
  const where: string[] = ['1 = 1'];
  const params: string[] = [];
  if (search?.trim()) {
    where.push('(b.title LIKE ? OR b.excerpt LIKE ? OR b.tag LIKE ?)');
    const like = `%${search.trim()}%`;
    params.push(like, like, like);
  }
  return query<AdminArticle>(
    `SELECT b.id, b.title, b.slug, b.excerpt, '' AS body, b.cover_image, b.tag,
            b.read_minutes, b.status, b.published_at, b.created_at,
            (SELECT COUNT(*) FROM blog_comments c WHERE c.blog_id = b.id) AS comment_count
       FROM blogs b
      WHERE ${where.join(' AND ')}
      ORDER BY COALESCE(b.published_at, b.created_at) DESC, b.id DESC`,
    params,
  );
}

/** Drafts included — the admin edits what the storefront cannot see. */
export async function getArticleForAdmin(id: number): Promise<Article | null> {
  const rows = await query<Article>(
    `SELECT id, title, slug, excerpt, body, cover_image, tag, read_minutes, status, published_at
       FROM blogs WHERE id = ?`,
    [id],
  );
  return rows[0] ?? null;
}

/** Every comment on every article, for moderation. */
export async function listCommentsForAdmin(): Promise<(Comment & {
  article: string; article_slug: string; status: string;
})[]> {
  return query(
    `SELECT c.id, c.blog_id, c.user_id, c.body, c.created_at, c.status,
            u.name AS author, u.avatar_path,
            b.title AS article, b.slug AS article_slug
       FROM blog_comments c
       JOIN users u ON u.id = c.user_id
       JOIN blogs b ON b.id = c.blog_id
      ORDER BY c.created_at DESC
      LIMIT 100`,
  );
}

/**
 * Reading time, counted once when the article is saved.
 *
 * 200 words a minute is the usual figure for prose; the floor is 1 because "0
 * min read" is nonsense on a piece that has any body at all.
 */
export function readingMinutes(body: string): number {
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
