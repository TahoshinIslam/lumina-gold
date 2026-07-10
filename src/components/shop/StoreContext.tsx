'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

/**
 * StoreContext — the storefront's client-side state: cart, wishlist, and
 * recently-viewed, all persisted to localStorage and shared reactively
 * across the header, product pages, cart, and checkout.
 */

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  engraving?: string;
  qty: number;
}

interface StoreValue {
  /* cart */
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  /* wishlist */
  wished: Record<string, boolean>;
  wishCount: number;
  toggleWish: (sku: string) => void;
  /* recently viewed */
  recent: string[];
  pushRecent: (sku: string) => void;
}

/** Line key = sku + size + engraving, so variants of one product stack right. */
const keyOf = (i: Pick<CartItem, 'sku' | 'size' | 'engraving'>) =>
  `${i.sku}__${i.size ?? ''}__${i.engraving ?? ''}`;

const StoreContext = createContext<StoreValue | null>(null);

function usePersisted<T>(storageKey: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setState(JSON.parse(raw));
    } catch { /* corrupt/blocked storage */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const set = useCallback((v: T | ((p: T) => T)) => {
    setState(prev => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [storageKey]);
  return [state, set];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersisted<CartItem[]>('lumina-cart', []);
  const [wished, setWished] = usePersisted<Record<string, boolean>>('lumina-wishlist', {});
  const [recent, setRecent] = usePersisted<string[]>('lumina-recent', []);

  const addToCart: StoreValue['addToCart'] = useCallback((item, qty = 1) => {
    setCart(prev => {
      const k = keyOf(item);
      const idx = prev.findIndex(i => keyOf(i) === k);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
  }, [setCart]);

  const updateQty: StoreValue['updateQty'] = useCallback((key, qty) => {
    setCart(prev => prev.flatMap(i => {
      if (keyOf(i) !== key) return [i];
      return qty <= 0 ? [] : [{ ...i, qty }];
    }));
  }, [setCart]);

  const removeFromCart: StoreValue['removeFromCart'] = useCallback((key) => {
    setCart(prev => prev.filter(i => keyOf(i) !== key));
  }, [setCart]);

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const toggleWish: StoreValue['toggleWish'] = useCallback((sku) => {
    setWished(prev => ({ ...prev, [sku]: !prev[sku] }));
  }, [setWished]);

  const pushRecent: StoreValue['pushRecent'] = useCallback((sku) => {
    setRecent(prev => [sku, ...prev.filter(s => s !== sku)].slice(0, 8));
  }, [setRecent]);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const cartSubtotal = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const wishCount = Object.values(wished).filter(Boolean).length;

  return (
    <StoreContext.Provider value={{
      cart, cartCount, cartSubtotal, addToCart, updateQty, removeFromCart, clearCart,
      wished, wishCount, toggleWish, recent, pushRecent,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>');
  return ctx;
}

export { keyOf as cartLineKey };
