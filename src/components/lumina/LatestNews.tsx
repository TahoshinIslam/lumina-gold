/**
 * LatestNews — three editorial cards (image with date badge, title,
 * excerpt, read-more + category tag). Content is placeholder until the
 * CMS `blogs` table is wired up.
 */
const POSTS = [
  {
    img: '/uploads/home/collection-eclat.png',
    date: 'July 2, 2026',
    tag: 'Trends',
    title: 'Gallery: The Éclat Solitaires',
    excerpt:
      'A closer look at this season’s most requested stones — and why the six-prong setting endures.',
  },
  {
    img: '/uploads/home/craft-artisan.png',
    date: 'June 18, 2026',
    tag: 'Craftsmanship',
    title: 'Inside the Atelier: Setting the Perfect Stone',
    excerpt:
      'Three hundred hours, one steady hand. Our master setter on patience, light, and the final clasp.',
  },
  {
    img: '/uploads/home/collection-riviere.png',
    date: 'June 5, 2026',
    tag: 'New Collection',
    title: 'A New Bridal Collection Is Taking Shape',
    excerpt:
      'From first sketches to wax models — an early glimpse of the parure we will unveil this festive season.',
  },
];

export default function LatestNews() {
  return (
    <section className="lum-news" id="news">
      <div className="lum-news-inner">
        <div className="lum-testimonials-head" data-reveal="up">
          <div className="lum-eyebrow-label">The Journal</div>
          <h2 className="lum-h2">Latest News</h2>
          <p className="lum-news-sub">Be aware of all the events in the world of jewellery.</p>
        </div>

        <div className="lum-news-grid" data-reveal="stagger">
          {POSTS.map(post => (
            <article key={post.title} className="lum-news-card" data-spothost="">
              <div className="lum-spot" data-spot="" />
              <div className="lum-news-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.img} alt={post.title} />
                <span className="lum-news-date">{post.date}</span>
              </div>
              <div className="lum-news-body">
                <h3 className="lum-news-title">{post.title}</h3>
                <p className="lum-news-excerpt">{post.excerpt}</p>
                <div className="lum-news-foot">
                  <a href="#news" className="lum-news-more">Read More →</a>
                  <span className="lum-news-tag">{post.tag}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
