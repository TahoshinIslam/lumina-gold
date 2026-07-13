'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATALOG } from '@/features/catalog/catalog';
import { formatPrice } from '@/types/product';

/**
 * SearchBox — magnifier button that opens an overlay with a live, instant
 * (client-side) search over the catalog. Debounced suggestions link
 * straight to the product; Enter runs a full search on /shop?q=…
 */
export default function SearchBox() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim().toLowerCase()), 140);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const results = useMemo(() => {
    if (debounced.length < 2) return [];
    const q = debounced;
    return CATALOG
      .map(p => {
        const hay = `${p.name} ${p.material} ${p.type} ${p.collection} ${p.style ?? ''} ${p.gender}`.toLowerCase();
        const score = p.name.toLowerCase().startsWith(q) ? 3 : hay.includes(q) ? 1 : 0;
        return { p, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(r => r.p);
  }, [debounced]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    setOpen(false);
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
                {results.length === 0 ? (
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
