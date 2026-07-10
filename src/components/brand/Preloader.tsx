/**
 * Preloader — full-screen intro: hand-drawn diamond line art, three orbiting
 * dots, and the shimmering LUMINA wordmark. The diamond completes drawing by
 * ~2.0s; useLuminaEffects lifts the curtain at 2.4s (after the final form is
 * reached), or 400ms with prefers-reduced-motion.
 */
export default function Preloader() {
  return (
    <div className="lum-preloader">
      <div className="lum-preloader-glow" />

      <div className="lum-preloader-emblem">
        <svg width="190" height="190" viewBox="0 0 120 120" fill="none" aria-hidden>
          <g stroke="#C89B3C" strokeWidth="1">
            <path
              d="M30 42 L60 22 L90 42 L60 100 Z"
              strokeDasharray="260"
              strokeDashoffset="260"
              style={{ animation: 'lum-draw 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards' }}
            />
            <path
              d="M30 42 L90 42"
              strokeDasharray="60"
              strokeDashoffset="60"
              style={{ animation: 'lum-draw 0.9s ease 0.7s forwards' }}
            />
            <path
              d="M30 42 L45 42 L60 22 M75 42 L60 22 M45 42 L60 100 L75 42 L90 42"
              strokeDasharray="280"
              strokeDashoffset="280"
              opacity="0.75"
              style={{ animation: 'lum-draw 1.3s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards' }}
            />
          </g>
        </svg>
        <div className="lum-orbit-dot" />
        <div className="lum-orbit-dot" />
        <div className="lum-orbit-dot" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div className="lum-preloader-word">LUMINA</div>
        <div className="lum-preloader-tag">Haute Joaillerie — Paris</div>
      </div>
    </div>
  );
}
