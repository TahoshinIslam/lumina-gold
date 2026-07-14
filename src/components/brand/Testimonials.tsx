'use client';

import { useState } from 'react';
import type { Testimonial } from '@/server/dal/testimonials';

/** Gold monogram avatar — initials in a circle (no client photos needed). */
function Monogram({ name }: { name: string }) {
  const words = name.split(' ').filter(Boolean);
  const initials =
    (words[0]?.replace('.', '').charAt(0) || '') +
    (words.length > 1 ? words[words.length - 1].charAt(0) : '');
  return <div className="lum-car-avatar">{initials}</div>;
}

/**
 * Testimonials — "Cherished by Collectors" carousel. One centered review
 * card with monogram avatar; neighbours peek faded at the sides; square
 * arrow buttons and dots (reference: Customers Reviews slider).
 *
 * The quotes come from Admin → Testimonials. They used to be a hardcoded array,
 * which meant the boutique could not put a real client's words on its own home
 * page — nor take down one it no longer wanted to show.
 */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  // With every quote hidden, a heading over an empty rail is worse than nothing.
  if (count === 0) return null;

  const prev = () => setIndex(i => (i + count - 1) % count);
  const next = () => setIndex(i => (i + 1) % count);

  return (
    <section className="lum-testimonials" id="testimonials">
      <div className="lum-testimonials-inner">
        <div className="lum-testimonials-head" data-reveal="up">
          <div className="lum-eyebrow-label">In Their Words</div>
          <h2 className="lum-h2">Cherished by Collectors</h2>
        </div>

        <div className="lum-carousel" data-reveal="up">
          <button className="lum-car-arrow" aria-label="Previous review" onClick={prev}>
            ←
          </button>

          <div className="lum-car-viewport">
            <div
              className="lum-car-track"
              style={{
                transform: `translateX(calc(50% - var(--slide-w) / 2 - ${index} * (var(--slide-w) + var(--car-gap))))`,
              }}
            >
              {items.map((t, i) => (
                <figure key={t.id} className={`lum-car-slide${i === index ? ' is-active' : ''}`}>
                  <Monogram name={t.author_name} />
                  <blockquote className="lum-testi-quote">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption>
                    <div className="lum-testi-name">{t.author_name}</div>
                    <div className="lum-testi-city">{t.author_title}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <button className="lum-car-arrow" aria-label="Next review" onClick={next}>
            →
          </button>
        </div>

        <div className="lum-car-dots" role="tablist" aria-label="Reviews">
          {items.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Review ${i + 1}`}
              className={`lum-car-dot${i === index ? ' is-active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
