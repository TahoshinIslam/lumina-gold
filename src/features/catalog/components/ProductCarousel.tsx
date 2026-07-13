'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useStore } from '@/stores/StoreContext';
import type { Product } from '@/types/product';

/**
 * A row of pieces you can page through.
 *
 * The arrows only exist when there is something off-screen to reach — a pair of
 * dead buttons either side of three products is worse than no buttons at all —
 * and each one is disabled at its end of the track.
 *
 * It is a scroll container, not a transform carousel: a touch swipe, a trackpad
 * flick and a keyboard all work without a line of code, and if the JavaScript
 * never arrives the products are still there and still scrollable.
 */
export default function ProductCarousel({ products }: { products: Product[] }) {
  const { wished, toggleWish } = useStore();
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const measure = () => {
      // 2px of slack: sub-pixel widths mean scrollLeft never quite equals the max.
      const max = el.scrollWidth - el.clientWidth;
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= max - 2);
    };
    measure();

    el.addEventListener('scroll', measure, { passive: true });
    // The row reflows on resize, and a window that got wider may no longer have
    // anything to scroll to.
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [products.length]);

  const page = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    // A page is one card plus its gap — scrolling by a whole viewport skips
    // pieces past without anyone seeing them.
    const card = el.querySelector<HTMLElement>('.lum-carousel-cell');
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  if (!products.length) return null;
  const scrollable = !(atStart && atEnd);

  return (
    <div className="lum-carousel-wrap">
      {scrollable && (
        <button type="button" className="lum-carousel-arrow is-prev" aria-label="Previous pieces"
          onClick={() => page(-1)} disabled={atStart}>
          <ChevronLeft size={18} />
        </button>
      )}

      <div className="lum-carousel-track" ref={track}>
        {products.map(product => (
          <div key={product.sku} className="lum-carousel-cell">
            <ProductCard product={product} wished={!!wished[product.sku]} onToggleWish={toggleWish} />
          </div>
        ))}
      </div>

      {scrollable && (
        <button type="button" className="lum-carousel-arrow is-next" aria-label="More pieces"
          onClick={() => page(1)} disabled={atEnd}>
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
