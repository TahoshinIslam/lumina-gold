'use client';

import { useState } from 'react';
import { TESTIMONIALS } from '@/components/brand/data';

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
 */
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = TESTIMONIALS.length;
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
              {TESTIMONIALS.map((t, i) => (
                <figure key={t.name} className={`lum-car-slide${i === index ? ' is-active' : ''}`}>
                  <Monogram name={t.name} />
                  <blockquote className="lum-testi-quote">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption>
                    <div className="lum-testi-name">{t.name}</div>
                    <div className="lum-testi-city">{t.city}</div>
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
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
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
