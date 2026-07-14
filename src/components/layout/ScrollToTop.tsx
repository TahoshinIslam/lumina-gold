'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Every route opens at the top.
 *
 * The App Router is supposed to do this itself, and here it doesn't: it scrolls
 * the new segment's node into view only if that node's top edge is off screen
 * (next/dist/client/components/layout-router.js), and by the time it looks, the
 * browser has already clamped the old scroll offset to the new, shorter document
 * — so the check passes, nothing moves, and Chrome's scroll anchoring then drags
 * the page back down as the rest of the route streams in. Opening a product from
 * halfway down the home page landed you halfway down the product page.
 *
 * So we scroll ourselves, and only where it is wanted:
 *   - a fresh navigation (the pathname changed) starts at the top;
 *   - back/forward does NOT — the browser has restored where the reader was, and
 *     taking that away is the thing scroll restoration exists to prevent;
 *   - a #hash link does not — the reader asked for a specific section;
 *   - the first render does not — nothing has been navigated to yet.
 *
 * Keyed on the pathname, never the query string: filters, search and admin
 * paging rewrite the query on the spot (router.replace(..., { scroll: false }))
 * and yanking the page to the top mid-filter is exactly what that flag is for.
 *
 * Before paint, not after: a layout effect runs in the same frame React commits
 * the new page, so the reader never sees the new route at the old offset.
 */
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function ScrollToTop() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const cameFromHistory = useRef(false);

  useEffect(() => {
    // popstate fires before React re-renders at the new URL, so the flag is
    // always set by the time the layout effect below reads it.
    const onPopState = () => { cameFromHistory.current = true; };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useBeforePaint(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (cameFromHistory.current) {
      cameFromHistory.current = false;
      return;
    }
    if (window.location.hash) return;

    // 'instant' explicitly: the stylesheet sets `scroll-behavior: smooth` for
    // in-page anchors, and inheriting it here would animate a scroll the reader
    // never asked for, through a page they have not seen yet.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
