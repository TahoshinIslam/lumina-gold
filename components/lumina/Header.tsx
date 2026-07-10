'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  PRIMARY_NAV_ALL,
  PRIMARY_NAV_LEFT,
  PRIMARY_NAV_RIGHT,
  PrimaryNavItem,
} from '../shop/navigation';
import { useStore } from '../shop/StoreContext';
import SearchBox from '../shop/SearchBox';
import CartDrawer from '../shop/CartDrawer';

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

  // Close the mobile menu automatically when resizing back to desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const onChange = () => { if (mq.matches) setMenuOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const renderItem = (item: PrimaryNavItem) => (
    <div key={item.label} className="lum-nav-item">
      <Link href={item.href} className="lum-nav-link">{item.label}</Link>

      {/* Full-width mega menu (Gold / Diamond) */}
      {item.mega && (
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

      {/* Simple dropdown (Collections) */}
      {item.dropdown && (
        <div className="lum-dropdown">
          {item.dropdown.map(link => (
            <Link key={link.label} href={link.href} className="lum-mega-link">
              {link.label}
            </Link>
          ))}
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
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21C12 21 5 14.8 5 9.5C5 5.9 8.1 3 12 3C15.9 3 19 5.9 19 9.5C19 14.8 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.6" />
              </svg>
              Gulshan Avenue, Dhaka
            </span>
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 4H9L11 9L8.5 10.5C9.6 12.8 11.2 14.4 13.5 15.5L15 13L20 15V19C20 20.1 19.1 21 18 21C10.3 20.5 3.5 13.7 3 6C3 4.9 3.9 4 5 4Z" />
              </svg>
              +880 1712-345678
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
          <div className="lum-header-note">Est. 1985 · Haute Joaillerie</div>
          <nav className="lum-nav-links">
            {[...PRIMARY_NAV_LEFT, ...PRIMARY_NAV_RIGHT].map(renderItem)}
          </nav>
          <div className="lum-header-promo">Special offers every week — up to 40% off</div>
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
