'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { formatPrice, type Product } from '@/types/product';
import { track } from '@/features/analytics/track';

/**
 * SearchBox — magnifier button that opens an overlay with live, debounced
 * suggestions. Suggestions link straight to the piece; Enter runs a full search
 * on /shop?q=…
 *
 * It searches the DATABASE (/api/products/search). It used to search a hardcoded
 * array of fictional pieces, so it could not find a single product the boutique
 * actually sells — typing the name of a real piece returned nothing, while an
 * invented one returned a link to a page that does not exist.
 */
export default function SearchBox() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  // The suggestions we hold are the answer to a PARTICULAR term, so "am I still
  // searching?" needs no flag of its own — and last term's pieces can never be
  // shown under this term's text while the next request is in flight.
  const [answer, setAnswer] = useState<{ q: string; products: Product[] }>({ q: '', products: [] });
  const inputRef = useRef<HTMLInputElement>(null);

  const settled = answer.q === debounced;
  const results = settled ? answer.products : [];
  const searching = !settled && debounced.length >= 2;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 220);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (debounced.length < 2) return;

    let cancelled = false;
    fetch(`/api/products/search?q=${encodeURIComponent(debounced)}`)
      .then(res => res.json())
      .then((data: { products?: Product[] }) => {
        if (!cancelled) setAnswer({ q: debounced, products: data.products ?? [] });
      })
      .catch(() => {
        // Offline, or the search failed: no suggestions, but Enter still works.
        if (!cancelled) setAnswer({ q: debounced, products: [] });
      });

    return () => { cancelled = true; };
  }, [debounced]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    setOpen(false);
    // The search TERM is the point of the event. It is truncated and never
    // joined to a user id — the session is a random uuid.
    track('search', { label: term.trim() });
    router.push(`/shop?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <>
      <button className="lum-icon-btn" aria-label="Search" onClick={() => setOpen(true)}>
        <svg className="lum-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </button>

      {open && (
        <div className="lum-search-overlay" onClick={() => setOpen(false)}>
          <div className="lum-search-panel" onClick={e => e.stopPropagation()}>
            <form className="lum-search-form" onSubmit={submit}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B08D4F" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                placeholder="Search rings, diamonds, collections…"
                value={term}
                onChange={e => setTerm(e.target.value)}
              />
              <button type="button" className="lum-search-close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
            </form>

            {debounced.length >= 2 && (
              <div className="lum-search-results">
                {searching ? (
                  // Not "no creations match" — that is a different, and wrong,
                  // thing to tell someone whose answer is still on its way.
                  <div className="lum-search-empty">Searching…</div>
                ) : results.length === 0 ? (
                  <div className="lum-search-empty">No creations match “{term}”.</div>
                ) : (
                  <>
                    {results.map(p => (
                      <Link key={p.sku} href={`/products/${p.slug}`} className="lum-search-item" onClick={() => setOpen(false)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt="" />
                        <span className="lum-search-item-info">
                          <span className="lum-search-item-name">{p.name}</span>
                          <span className="lum-search-item-meta">{p.material} · {p.type}</span>
                        </span>
                        <span className="lum-search-item-price">{formatPrice(p.price)}</span>
                      </Link>
                    ))}
                    <button className="lum-search-all" onClick={submit as unknown as () => void}>
                      See all results for “{term}” →
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
