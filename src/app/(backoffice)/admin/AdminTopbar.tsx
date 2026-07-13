'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, LogOut, MessageSquare, Search, User } from 'lucide-react';
import { logoutAction } from './actions';

/**
 * Search + notifications + account menu. Search hands off to the products
 * screen, which already knows how to filter.
 */
export function AdminTopbar({ name, role }: { name: string; role: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="adm-topbar-right">
      <form className="adm-topsearch" action="/admin/products">
        <Search size={16} aria-hidden />
        <input name="q" type="search" placeholder="Search stock, order, etc" aria-label="Search" />
      </form>

      <Link href="/admin/orders" className="adm-icon-btn" aria-label="Messages">
        <MessageSquare size={18} />
      </Link>

      <Link href="/admin/inventory" className="adm-icon-btn" aria-label="Notifications">
        <Bell size={18} />
        <span className="adm-icon-dot" />
      </Link>

      <div className="adm-user" ref={ref}>
        <button type="button" className="adm-user-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
          <span className="adm-avatar">{initials}</span>
          <span className="adm-user-meta">
            <strong>{name}</strong>
            <small>{role}</small>
          </span>
          <ChevronDown size={16} className={open ? 'rot' : ''} />
        </button>

        {open && (
          <div className="adm-user-menu" role="menu">
            <Link href="/account" role="menuitem"><User size={15} /> Profile</Link>
            <form action={logoutAction}>
              <button type="submit" role="menuitem"><LogOut size={15} /> Sign out</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
