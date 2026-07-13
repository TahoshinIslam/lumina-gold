import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getArticles } from '@/server/dal/journal';

export const metadata: Metadata = {
  title: 'The Journal — Nahar Jewellers',
  description: 'Notes from the workshop: gold, diamonds, craft and the world of jewellery.',
};

export const dynamic = 'force-dynamic';

const WHEN = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** /journal — everything the boutique has published. */
export default async function Journal() {
  const articles = await getArticles();

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-listing">
          <div className="lum-listing-head">
            <div>
              <div className="lum-eyebrow-label" style={{ marginBottom: 10 }}>The Journal</div>
              <h1 className="lum-h2 lum-listing-title">Notes from the workshop</h1>
              <div className="lum-listing-count">
                {articles.length} {articles.length === 1 ? 'article' : 'articles'}
              </div>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="lum-empty-results" style={{ marginTop: 30 }}>
              Nothing published yet — the first article will appear here.
            </div>
          ) : (
            <div className="lum-journal-grid">
              {articles.map(article => (
                <Link key={article.id} href={`/journal/${article.slug}`} className="lum-journal-card">
                  <div className="lum-journal-media lum-img-ph">
                    {article.cover_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.cover_image} alt="" loading="lazy" />
                    )}
                    {article.tag && <span className="lum-journal-tag">{article.tag}</span>}
                  </div>
                  <div className="lum-journal-body">
                    <div className="lum-journal-meta">
                      {article.published_at ? WHEN.format(new Date(article.published_at)) : 'Unpublished'}
                      {' · '}{article.read_minutes} min read
                      {article.comment_count ? ` · ${article.comment_count} comments` : ''}
                    </div>
                    <h2 className="lum-journal-title">{article.title}</h2>
                    <p className="lum-journal-excerpt">{article.excerpt}</p>
                    <span className="lum-col-explore">Read <span style={{ fontSize: 15 }}>→</span></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
