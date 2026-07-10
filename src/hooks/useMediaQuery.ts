'use client';

import { useEffect, useState } from 'react';

/**
 * useMediaQuery — reactive boolean for a CSS media query.
 *
 * SSR-safe: returns `false` on the server and first client paint, then syncs
 * to the real value on mount and updates whenever the query result changes.
 *
 *   const isDesktop = useMediaQuery('(min-width: 900px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // sync the initial value on mount
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
