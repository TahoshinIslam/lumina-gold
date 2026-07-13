import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getArticle, getComments, getRelatedArticles } from '@/server/dal/journal';
import { getCurrentCustomer } from '@/server/auth/customer';
import Comments from '@/features/journal/components/Comments';

export const dynamic = 'force-dynamic';

const WHEN = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'The Journal — Nahar Jewellers' };
  return {
    title: `${article.title} — Nahar Jewellers`,
    description: article.excerpt ?? undefined,
    openGraph: article.cover_image ? { images: [article.cover_image] } : undefined,
  };
}

/**
 * /journal/[slug] — one article, and the conversation under it.
 *
 * The body is written as plain text with blank lines between paragraphs, and is
 * rendered as paragraphs — NOT as HTML. An admin pasting markup would otherwise
 * be able to put a script on the storefront, and no amount of "we trust the
 * admin" makes that a good idea when the alternative costs one split().
 */
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const [comments, related, customer] = await Promise.all([
    getComments(article.id),
    getRelatedArticles(article),
    getCurrentCustomer(),
  ]);

  // Tolerant of CRLF as well as LF — older rows were stored before the save
  // normalised line endings.
  const paragraphs = article.body.split(/(?:\r?\n){2,}/).map(p => p.trim()).filter(Boolean);

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <article className="lum-article">
          <Link href="/journal" className="lum-link-gold">← The Journal</Link>

          <header className="lum-article-head">
            {article.tag && <div className="lum-eyebrow-label">{article.tag}</div>}
            <h1 className="lum-h2 lum-article-title">{article.title}</h1>
            <div className="lum-journal-meta">
              {article.published_at ? WHEN.format(new Date(article.published_at)) : ''}
              {' · '}{article.read_minutes} min read
            </div>
          </header>

          {article.cover_image && (
            <div className="lum-article-cover lum-img-ph">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.cover_image} alt="" />
            </div>
          )}

          {article.excerpt && <p className="lum-article-lead">{article.excerpt}</p>}

          <div className="lum-article-body">
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>

          <Comments slug={article.slug} comments={comments} viewerId={customer?.id ?? null} />

          {related.length > 0 && (
            <section className="lum-article-more">
              <h2 className="lum-cart-summary-title">Read next</h2>
              <div className="lum-journal-grid">
                {related.map(next => (
                  <Link key={next.id} href={`/journal/${next.slug}`} className="lum-journal-card">
                    <div className="lum-journal-media lum-img-ph">
                      {next.cover_image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={next.cover_image} alt="" loading="lazy" />
                      )}
                    </div>
                    <div className="lum-journal-body">
                      <h3 className="lum-journal-title">{next.title}</h3>
                      <p className="lum-journal-excerpt">{next.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
