import Link from 'next/link';

/**
 * Storefront 404.
 *
 * The root not-found, so it catches every public URL that resolves to nothing.
 * It renders inside the root layout (fonts + tokens.css already loaded), so it
 * can lean on the storefront palette directly: forest-black ground, champagne
 * gold, the Fraunces display face. Deliberately self-contained — no Header or
 * Footer — because those pull nav data and the store context, and a 404 must
 * render even when something upstream is the reason a page is missing.
 */
export const metadata = { title: 'Page not found — Nahar Jewellers' };

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        background:
          'radial-gradient(120% 90% at 50% 0%, var(--background-light) 0%, var(--background-dark) 60%)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-archivo), sans-serif',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-fraunces), serif',
          fontSize: '0.72rem',
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: 'var(--gold-primary)',
          marginBottom: 40,
        }}
      >
        Nahar Jewellers
      </div>

      <div
        style={{
          fontFamily: 'var(--font-fraunces), serif',
          fontWeight: 300,
          fontSize: 'clamp(5rem, 18vw, 11rem)',
          lineHeight: 0.9,
          letterSpacing: '0.02em',
          background: 'linear-gradient(180deg, var(--gold-light) 0%, var(--gold-dark) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-fraunces), serif',
          fontWeight: 400,
          fontStyle: 'italic',
          fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
          margin: '18px 0 12px',
          color: 'var(--text-primary)',
        }}
      >
        This page has slipped from the vault
      </h1>

      <p
        style={{
          maxWidth: 460,
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          margin: '0 0 40px',
        }}
      >
        The piece you were looking for may have been moved, sold, or never
        existed. Let us guide you back to the collection.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            padding: '14px 30px',
            fontSize: '0.82rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--background-dark)',
            background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 55%, var(--gold-dark) 100%)',
            borderRadius: 2,
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Return home
        </Link>
        <Link
          href="/shop"
          style={{
            padding: '14px 30px',
            fontSize: '0.82rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)',
            border: '1px solid var(--gold-dark)',
            borderRadius: 2,
            textDecoration: 'none',
          }}
        >
          Browse the collection
        </Link>
      </div>
    </main>
  );
}
