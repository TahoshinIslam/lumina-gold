'use client';

import { useRef } from 'react';
import '@/app/lumina.css';

import { useLuminaEffects } from './useLuminaEffects';
import Preloader from './Preloader';
import Header from './Header';
import Hero from './Hero';
import ShopByCategory from './ShopByCategory';
import Marquee from './Marquee';
import Collections from './Collections';
import ParallaxShowcase from './ParallaxShowcase';
import Craftsmanship from './Craftsmanship';
import BestSellers from './BestSellers';
import Quote from './Quote';
import Heritage from './Heritage';
import Testimonials from './Testimonials';
import LatestNews from './LatestNews';
import Appointment from './Appointment';
import Footer from './Footer';

/**
 * LuminaPage — composition root for the LUMINA landing page.
 *
 * Page order:  Preloader → Header/Nav → Hero → Marquee → Collections →
 *              Craftsmanship → Best Sellers → Quote → Heritage →
 *              Testimonials → Appointment → Footer
 *
 * All interactive behavior (particles, cursor, tilt, magnetic, spotlight,
 * reveals, count-ups, smooth scroll, nav shrink, hero parallax) lives in
 * useLuminaEffects — section components are purely presentational and just
 * carry data-* attributes the hook picks up.
 */
export default function LuminaPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLuminaEffects(rootRef);

  return (
    <div ref={rootRef} className="lum-root">
      {/* Fixed overlays */}
      <canvas className="lum-canvas" />
      <div className="lum-cursor-dot" />
      <div className="lum-cursor-ring" />
      <Preloader />
      <Header />

      {/* Page content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <ShopByCategory />
        <Marquee />
        <Collections />
        <Craftsmanship />
        <BestSellers />
        <Quote />
        <Heritage />
        <ParallaxShowcase />
        <Testimonials />
        <LatestNews />
        <Appointment />
        <Footer />
      </div>
    </div>
  );
}
