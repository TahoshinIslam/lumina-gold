'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Keeps a server-rendered page's data fresh in the two cases Next.js cannot
 * cover on its own. Renders nothing.
 *
 * 1. THE BACK BUTTON. From Next's own glossary: pages "are not cached by
 *    default but are reused during browser back/forward navigation". A forward
 *    click always hits the server; Back replays whatever the client cache last
 *    saw — which may be an order that has since shipped.
 *
 * 2. A PAGE LEFT OPEN. There is no server→browser push here. `revalidatePath`
 *    in an admin action clears the SERVER's cache; it cannot reach a customer's
 *    browser sitting on their tracking page in another city. So the page asks
 *    again when the tab comes back to the foreground, and — where the data is
 *    genuinely live, like a piece being made — on a slow interval.
 *
 * Polling only runs while the tab is visible: a phone in a pocket has no reason
 * to keep hitting the database.
 */

/**
 * `popstate` fires BEFORE the restored page's components mount, so refreshing
 * from inside the handler would refresh the route we are leaving, not the one
 * we land on. Instead the handler just raises a flag, and the LiveData that
 * mounts on the restored page acts on it. Module scope, because the component
 * that reads the flag is not the one that set it.
 */
let arrivedViaHistory = false;

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => { arrivedViaHistory = true; });
}

export default function LiveData({ pollSeconds = 0 }: { pollSeconds?: number }) {
  const router = useRouter();
  const last = useRef(0);

  useEffect(() => {
    // focus and visibilitychange both fire when a tab is re-opened; without this
    // guard the page would fetch itself twice for one return.
    const refresh = () => {
      const now = Date.now();
      if (now - last.current < 2000) return;
      last.current = now;
      router.refresh();
    };
    const whenVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    // We are mounting on a page the browser restored from its cache.
    if (arrivedViaHistory) {
      arrivedViaHistory = false;
      refresh();
    }

    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', whenVisible);
    const timer = pollSeconds > 0 ? setInterval(whenVisible, pollSeconds * 1000) : undefined;

    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', whenVisible);
      if (timer) clearInterval(timer);
    };
  }, [router, pollSeconds]);

  return null;
}
