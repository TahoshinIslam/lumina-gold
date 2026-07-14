import Link from 'next/link';
import { COLLECTIONS } from '@/components/brand/data';
import MediaSlideshow from '@/components/brand/MediaSlideshow';
import { splitAcrossCards } from '@/config/home';
import type { SlideImage } from '@/server/dal/home';

/**
 * Collections — "Three Expressions of Light". Staggered card grid
 * (2nd and 3rd cards are pushed down via CSS nth-child margins) with
 * 3D tilt + glare on hover.
 *
 * `images` are whatever the admin uploaded under Home Models, dealt
 * round-robin across the three cards; a card given more than one fades
 * between them. With nothing uploaded each card keeps its shipped still.
 */
export default function Collections({ images }: { images: SlideImage[] }) {
  const perCard = splitAcrossCards(images, COLLECTIONS.length);

  return (
    <section id="collections" className="lum-collections">
      <div className="lum-collections-inner">
        {/* Section header */}
        <div className="lum-collections-head" data-reveal="left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="lum-eyebrow">
              <div className="lum-rule lum-rule--solid" />
              <div className="lum-eyebrow-label">The Collections</div>
            </div>
            <h2 className="lum-h2">
              Three Expressions
              <br />
              of Light
            </h2>
          </div>
          <div className="lum-collections-note">
            Each collection is a study in how gold holds warmth, and how a diamond returns it.
          </div>
        </div>

        {/* Cards */}
        <div className="lum-col-grid">
          {COLLECTIONS.map((collection, card) => (
            // A card that says "Explore →" and does nothing is a broken promise.
            <Link key={collection.number} href={collection.href}
              className="lum-col-card" data-reveal="clip" data-tilt="">
              <div className="lum-col-media">
                <MediaSlideshow
                  renderWidth={828}
                  className="lum-col-zoom lum-img-ph"
                  images={perCard[card].length ? perCard[card] : [{ src: collection.src }]}
                  alt={collection.alt}
                />
                <div className="lum-glare" data-glare="" />
                <div className="lum-col-badge">{collection.number}</div>
              </div>
              <div className="lum-col-body">
                <h3 className="lum-col-title">{collection.name}</h3>
                <p className="lum-col-desc">{collection.description}</p>
                <div className="lum-col-explore">
                  Explore <span style={{ fontSize: 15 }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
