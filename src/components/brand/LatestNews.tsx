import Link from 'next/link';
import type { Article } from '@/server/dal/journal';
import { optimized } from '@/features/shared/optimized';

/**
 * LatestNews — the three most recent published articles.
 *
 * These were three hardcoded placeholder posts whose "Read More" linked back to
 * the section itself. They now come from the Journal (Admin → Journal) and each
 * card opens the real article. With nothing published the section hides itself,
 * rather than showing invented news.
 */
const WHEN = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default function LatestNews({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="lum-news" id="news">
      <div className="lum-news-inner">
        <div className="lum-testimonials-head" data-reveal="up">
          <div className="lum-eyebrow-label">The Journal</div>
          <h2 className="lum-h2">Latest News</h2>
          <p className="lum-news-sub">Be aware of all the events in the world of jewellery.</p>
        </div>

        <div className="lum-news-grid" data-reveal="stagger">
          {articles.map(article => (
            <Link key={article.id} href={`/journal/${article.slug}`}
              className="lum-news-card" data-spothost="">
              <div className="lum-spot" data-spot="" />
              <div className="lum-news-media lum-img-ph">
                {article.cover_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={optimized(article.cover_image, 640)} alt={article.title} loading="lazy" />
                )}
                {article.published_at && (
                  <span className="lum-news-date">{WHEN.format(new Date(article.published_at))}</span>
                )}
              </div>
              <div className="lum-news-body">
                <h3 className="lum-news-title">{article.title}</h3>
                <p className="lum-news-excerpt">{article.excerpt}</p>
                <div className="lum-news-foot">
                  <span className="lum-news-more">Read More →</span>
                  {article.tag && <span className="lum-news-tag">{article.tag}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/journal" className="lum-cta-ghost">All articles</Link>
        </div>
      </div>
    </section>
  );
}
