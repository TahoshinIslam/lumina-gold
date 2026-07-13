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
  name = 'q', placeholder, defaultValue, delay = 400,
}: {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  delay?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <input
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={event => {
        if (timer.current) clearTimeout(timer.current);
        const form = event.currentTarget.form;
        timer.current = setTimeout(() => {
          if (!form) return;
          const params = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, delay);
      }}
    />
  );
}
