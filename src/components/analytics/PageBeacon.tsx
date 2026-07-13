'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Fires one /api/track view per storefront navigation. Mounted in the root
 * layout so client-side route changes are counted too — a server-side hook
 * would miss them entirely, and would never fire at all on the statically
 * generated product pages.
 */

// Module scope, so it survives the re-render StrictMode does in dev and we
// don't book the same view twice.
let lastPath = '';
let lastAt = 0;

export default function PageBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    const now = Date.now();
    if (pathname === lastPath && now - lastAt < 1000) return;
    lastPath = pathname;
    lastAt = now;

    // Analytics must never break a page render, hence the silent catch.
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || null }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
