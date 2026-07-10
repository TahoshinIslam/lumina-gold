import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopPage from '@/features/catalog/components/ShopPage';

export const metadata: Metadata = {
  title: 'The Boutique — LUMINA',
  description: 'Shop gold and diamond haute joaillerie by category, purity, color, occasion and price.',
};

/**
 * /shop — the single listing route. Every mega-menu entry, collection,
 * occasion and recipient page is this route with preset query filters.
 */
export default function Shop() {
  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <Suspense>
          <ShopPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
