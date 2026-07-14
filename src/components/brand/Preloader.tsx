/**
 * Preloader — full-screen intro: hand-drawn diamond line art, three orbiting
 * dots, and the shimmering wordmark. The three strokes below are staggered to
 * finish together at ~0.96s, just under the 1000ms curtain lift in
 * useLuminaEffects (400ms with prefers-reduced-motion) — the emblem must reach
 * its final form before it leaves. Shorten the lift and these must follow.
 */
export default function Preloader() {
  return (
    <div className="lum-preloader">
      <div className="lum-preloader-glow" />

      <div className="lum-preloader-emblem">
        <svg width="190" height="190" viewBox="0 0 120 120" fill="none" aria-hidden>
          <g stroke="#DAA858" strokeWidth="1">
            <path
              d="M30 42 L60 22 L90 42 L60 100 Z"
              strokeDasharray="260"
              strokeDashoffset="260"
              style={{ animation: 'lum-draw 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.05s forwards' }}
            />
            <path
              d="M30 42 L90 42"
              strokeDasharray="60"
              strokeDashoffset="60"
              style={{ animation: 'lum-draw 0.42s ease 0.32s forwards' }}
            />
            <path
              d="M30 42 L45 42 L60 22 M75 42 L60 22 M45 42 L60 100 L75 42 L90 42"
              strokeDasharray="280"
              strokeDashoffset="280"
              opacity="0.75"
              style={{ animation: 'lum-draw 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.36s forwards' }}
            />
          </g>
        </svg>
        <div className="lum-orbit-dot" />
        <div className="lum-orbit-dot" />
        <div className="lum-orbit-dot" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div className="lum-preloader-word">NAHAR JEWELLERS</div>
        <div className="lum-preloader-tag">Haute Joaillerie — Paris</div>
      </div>
    </div>
  );
}
