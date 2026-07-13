'use client';

import { useRef } from 'react';
import { useLuminaEffects } from '@/hooks/useLuminaEffects';

/**
 * PageShell — the transition + ambience wrapper for every non-landing route.
 *
 * Mounted from each route group's `template.tsx`, so React re-mounts it on
 * every navigation. That re-mount is what replays the entrance animation and
 * re-runs useLuminaEffects against the incoming page's DOM (a layout would
 * only run once, and would never see the new page's elements).
 *
 * The landing page composes its own chrome in LuminaPage and is deliberately
 * NOT wrapped here — it would end up with two dust canvases and two cursors.
 */
export default function PageShell({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useLuminaEffects(rootRef);

  return (
    <div ref={rootRef} className="lum-page-enter">
      <canvas className="lum-canvas" />
      <div className="lum-cursor-dot" />
      <div className="lum-cursor-ring" />
      <div className="lum-page-sweep" aria-hidden />
      {children}
    </div>
  );
}
