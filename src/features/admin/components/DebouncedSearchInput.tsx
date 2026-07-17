'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Drop-in replacement for a plain `<input name="q">` inside one of the admin
 * list toolbars (`<form method="get">`). Typing still updates the URL — via a
 * debounced `router.replace` built from the *whole* form's FormData, so
 * category/status/sort/dir survive alongside `q` — instead of requiring a
 * click on "Filter" or reloading the page on every keystroke.
 */
export function DebouncedSearchInput({
  name = 'q', placeholder, defaultValue, delay = 400, className,
}: {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  delay?: number;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <input
      type="search"
      name={name}
      className={className}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={event => {
        if (timer.current) clearTimeout(timer.current);
        const form = event.currentTarget.form;
        timer.current = setTimeout(() => {
          if (!form) return;
          replaceFromForm(router, pathname, form);
        }, delay);
      }}
    />
  );
}

/**
 * A <select> that filters immediately on change, in the same AJAX way — it
 * lives in a search <form> and updates the URL from the whole form's data, so
 * it composes with a DebouncedSearchInput beside it (the current search text is
 * preserved, and vice versa) without a page reload or a "Filter" button.
 */
export function AutoSubmitSelect({
  name, defaultValue, className, children,
}: {
  name: string;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <select
      name={name}
      className={className}
      defaultValue={defaultValue}
      onChange={event => {
        const form = event.currentTarget.form;
        if (form) replaceFromForm(router, pathname, form);
      }}
    >
      {children}
    </select>
  );
}

/** Build the querystring from the whole form and soft-navigate to it — so every
 *  filter in the toolbar (q, category, status, sort, dir) survives together.
 *  Kept identical to the original single-input behaviour so the list pages
 *  already using it don't change. */
function replaceFromForm(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  form: HTMLFormElement,
) {
  const params = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
  router.replace(`${pathname}?${params.toString()}`, { scroll: false });
}
