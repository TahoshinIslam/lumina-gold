'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/**
 * A dropdown that belongs to this shop.
 *
 * A native <select> can be styled down to the last pixel and it makes no
 * difference: the list it opens is drawn by the operating system, so on macOS
 * the shop's gold-on-forest turns into a white sheet with a blue highlight the
 * moment you click it. There is no CSS for that — the only way to control the
 * open list is to render it ourselves.
 *
 * So this is a listbox, and it keeps the parts of <select> that matter:
 *   - it can carry a `name` and submit inside a plain <form> (hidden input),
 *   - the keyboard works — arrows, Home/End, Enter/Space, Escape, and typing a
 *     letter jumps to the option starting with it,
 *   - closed and open both read correctly to a screen reader.
 *
 * Controlled when `value` is passed, uncontrolled otherwise.
 */
export interface SelectOption {
  value: string;
  label: string;
}

export default function Select({
  options, value, defaultValue, onChange, name, ariaLabel, className,
}: {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? options[0]?.value ?? '');
  const current = value ?? uncontrolled;

  const [open, setOpen] = useState(false);
  // Which option the keyboard is on. Not the same as the chosen one: you can
  // arrow down the list and change your mind by pressing Escape.
  const [active, setActive] = useState(0);

  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const selectedIndex = Math.max(0, options.findIndex(option => option.value === current));
  const selected = options[selectedIndex];

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    if (value === undefined) setUncontrolled(option.value);
    onChange?.(option.value);
    close();
  };

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  // Clicking anywhere else — or scrolling the page away under it — closes the
  // list, the way an OS menu would.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Move focus into the list when it opens, so the arrow keys land somewhere.
  useEffect(() => {
    if (open) list.current?.focus();
  }, [open]);

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) return openList();
        return setActive(index => Math.min(options.length - 1, index + 1));
      case 'ArrowUp':
        event.preventDefault();
        if (!open) return openList();
        return setActive(index => Math.max(0, index - 1));
      case 'Home':
        if (!open) return;
        event.preventDefault();
        return setActive(0);
      case 'End':
        if (!open) return;
        event.preventDefault();
        return setActive(options.length - 1);
      case 'Enter':
      case ' ':
        event.preventDefault();
        return open ? choose(active) : openList();
      case 'Escape':
        if (!open) return;
        event.preventDefault();
        return close();
      case 'Tab':
        if (open) setOpen(false);
        return;
      default: {
        if (event.key.length !== 1) return;
        const from = open ? active + 1 : selectedIndex + 1;
        const letter = event.key.toLowerCase();
        // Wrap around from wherever we are, so pressing the same letter twice
        // walks through every option starting with it.
        const order = options.map((_, i) => (from + i) % options.length);
        const hit = order.find(i => options[i].label.toLowerCase().startsWith(letter));
        if (hit === undefined) return;
        event.preventDefault();
        if (open) setActive(hit);
        else choose(hit);
      }
    }
  };

  return (
    <div className={`lum-select ${className ?? ''}`} ref={root}>
      {name && <input type="hidden" name={name} value={current} />}

      <button
        ref={button}
        type="button"
        className={`lum-select-btn${open ? ' is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="lum-select-value">{selected?.label ?? ''}</span>
        <ChevronDown size={14} className="lum-select-caret" aria-hidden="true" />
      </button>

      {open && (
        <ul
          ref={list}
          className="lum-select-menu"
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-activedescendant={`lum-opt-${options[active]?.value}`}
          onKeyDown={onKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`lum-opt-${option.value}`}
              role="option"
              aria-selected={option.value === current}
              className={`lum-select-opt${index === active ? ' is-active' : ''}${
                option.value === current ? ' is-selected' : ''}`}
              // pointerdown, not click: the window listener above closes the list
              // on any pointerdown outside it, and a click that starts inside and
              // ends inside still needs to win the race.
              onPointerDown={event => { event.preventDefault(); choose(index); }}
              onPointerEnter={() => setActive(index)}
            >
              <span className="lum-select-tick" aria-hidden="true">
                {option.value === current && <Check size={13} />}
              </span>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
