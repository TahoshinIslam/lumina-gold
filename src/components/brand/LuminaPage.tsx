'use client';

import { useRef } from 'react';
import '@/app/lumina.css';

import { useLuminaEffects } from '@/hooks/useLuminaEffects';
import Preloader from '@/components/brand/Preloader';
import Header from '@/components/layout/Header';
import Hero from '@/components/brand/Hero';
import ShopByCategory from '@/components/brand/ShopByCategory';
import Marquee from '@/components/brand/Marquee';
import Collections from '@/components/brand/Collections';
import ParallaxShowcase from '@/components/brand/ParallaxShowcase';
import Craftsmanship from '@/components/brand/Craftsmanship';
import BestSellers from '@/components/brand/BestSellers';
import Quote from '@/components/brand/Quote';
import Heritage from '@/components/brand/Heritage';
import Testimonials from '@/components/brand/Testimonials';
import LatestNews from '@/components/brand/LatestNews';
import Appointment from '@/components/brand/Appointment';
import Footer from '@/components/layout/Footer';

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
