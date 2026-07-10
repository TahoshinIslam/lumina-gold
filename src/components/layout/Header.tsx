'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  PRIMARY_NAV_ALL,
  PRIMARY_NAV_LEFT,
  PRIMARY_NAV_RIGHT,
  PrimaryNavItem,
} from '@/config/navigation';
import { useStore } from '@/stores/StoreContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import SearchBox from '@/features/search/components/SearchBox';
import CartDrawer from '@/features/cart/components/CartDrawer';

/**
 * Header — two-tier navigation.
 *
 *   Row 1  contact info · centered brand · utility icons
 *   Row 2  centered primary menu (Gold/Diamond mega menus, Collections
 *          dropdown) · weekly-offer note
 *
 * variant="landing"  fades in after the preloader; gains a shadow on scroll
 * variant="shop"     visible immediately (listing/product pages)
 */
export default function Header({ variant = 'landing' }: { variant?: 'landing' | 'shop' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount, wishCount } = useStore();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  // Close the mobile menu automatically when resizing back to desktop.
  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  const renderItem = (item: PrimaryNavItem) => (
    <div key={item.label} className="lum-nav-item">
      <Link href={item.href} className="lum-nav-link">
        {item.label}
        {item.mega.length > 0 && (
          <svg className="lum-nav-caret" width="9" height="9" viewBox="0 0 10 10"
               fill="none" stroke="currentColor" strokeWidth="1.4"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1.5 3.5 5 6.75 8.5 3.5" />
          </svg>
        )}
      </Link>

      {/* Full-width horizontal mega menu */}
      {item.mega.length > 0 && (
        <div className="lum-mega">
          <div className="lum-mega-inner">
            {item.mega.map(column => (
              <div key={column.heading} className="lum-mega-col">
                <div className="lum-mega-heading">{column.heading}</div>
                {column.links.map(link => (
                  <Link key={link.label} href={link.href} className="lum-mega-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className={`lum-header${variant === 'shop' ? ' lum-header--shop' : ''}`}>
        {/* ── Row 1: contact · brand · icons ── */}
        <div className="lum-header-top">
          <div className="lum-header-contact">
            <div className="lum-header-social">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6C16.6 2.5 15.6 2.5 14.5 2.5c-2.3 0-3.9 1.4-3.9 4v2H8v3h2.6V21h3.4v-9.5h2.5l.4-3H14z" />
                </svg>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://x.com" aria-label="X" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.2 2.5h3.3l-7.2 8.2 8.5 11.3h-6.6l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.2 2.5h6.8l4.7 6.2 5.5-6.2zm-1.2 17.7h1.8L7.1 4.3H5.2l11.8 15.9z" />
                </svg>
              </a>
              <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 7.5c-.3-1.1-1-1.8-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4C2 5.7 1.3 6.4 1 7.5.6 9.4.6 12 .6 12s0 2.6.4 4.5c.3 1.1 1 1.8 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4c1.1-.3 1.8-1 2.1-2.1.4-1.9.4-4.5.4-4.5s0-2.6-.4-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
                </svg>
              </a>
            </div>
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
              Mon-Fri: 10:00 - 18:00
            </span>
          </div>

          <Link href="/" className="lum-nav-brand-wrap" aria-label="LUMINA home">
            <div className="lum-diamond" />
            <div className="lum-brand">LUMINA</div>
            <div className="lum-diamond" />
          </Link>

          <div className="lum-nav-icons">
            <SearchBox />

            {/* Account */}
            <Link className="lum-icon-btn" href="/account" aria-label="Account">
              <svg className="lum-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21C4 16.9 7.6 14 12 14C16.4 14 20 16.9 20 21" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link className="lum-icon-btn" href="/wishlist" aria-label={`Wishlist (${wishCount})`}>
              <svg className="lum-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.4">
                <path d="M12 21C12 21 3 14.5 3 8.8C3 5.6 5.5 3.5 8 3.5C9.8 3.5 11.3 4.5 12 6C12.7 4.5 14.2 3.5 16 3.5C18.5 3.5 21 5.6 21 8.8C21 14.5 12 21 12 21Z" />
              </svg>
              {wishCount > 0 && <span className="lum-icon-badge">{wishCount}</span>}
            </Link>

            {/* Bag */}
            <button className="lum-icon-btn" aria-label={`Bag (${cartCount})`} onClick={() => setCartOpen(true)}>
              <svg className="lum-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.4">
                <path d="M5 8H19L20 21H4L5 8Z" />
                <path d="M8.5 10V6.5C8.5 4.6 10 3 12 3C14 3 15.5 4.6 15.5 6.5V10" />
              </svg>
              {cartCount > 0 && <span className="lum-icon-badge">{cartCount}</span>}
            </button>
          </div>

          <div
            className={`lum-hamburger${menuOpen ? ' is-open' : ''}`}
            role="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
          >
            <span />
            <span />
          </div>
        </div>

        {/* ── Row 2: note · menu · promo ── */}
        <div className="lum-header-row2">
          <div />
          <nav className="lum-nav-links">
            {[...PRIMARY_NAV_LEFT, ...PRIMARY_NAV_RIGHT].map(renderItem)}
          </nav>
          <div />
        </div>
      </header>

      {/* Mobile menu — flat list of the primary nav */}
      <div className={`lum-mobile-menu${menuOpen ? ' is-open' : ''}`}>
        {PRIMARY_NAV_ALL.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className="lum-mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <div className="lum-mobile-rule">
          <div className="lum-rule lum-rule--l" style={{ width: 40 }} />
          <div className="lum-diamond" style={{ width: 8, height: 8 }} />
          <div className="lum-rule lum-rule--r" style={{ width: 40 }} />
        </div>
        <div className="lum-mobile-cities">Paris · Genève · New York</div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
