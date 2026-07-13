'use client';

import { Star } from 'lucide-react';

/**
 * Stars — read-only, or an input when `onPick` is given.
 *
 * As an input it is a real radio group, not a row of divs: keyboard users get
 * arrow keys and a focus ring for free, and it submits inside a plain form.
 */
export default function Stars({ value, size = 15, onPick, name }: {
  value: number;
  size?: number;
  onPick?: (value: number) => void;
  name?: string;
}) {
  if (!onPick) {
    return (
      <span className="lum-stars" aria-label={`${value} out of 5`}>
        {[1, 2, 3, 4, 5].map(n => (
          <Star key={n} size={size} className={n <= Math.round(value) ? 'is-on' : ''}
            fill={n <= Math.round(value) ? 'currentColor' : 'none'} />
        ))}
      </span>
    );
  }

  return (
    <span className="lum-stars is-input" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map(n => (
        <label key={n} className="lum-star-pick">
          <input type="radio" name={name ?? 'rating'} value={n}
            checked={value === n} onChange={() => onPick(n)} required />
          <Star size={size} className={n <= value ? 'is-on' : ''}
            fill={n <= value ? 'currentColor' : 'none'} />
          <span className="lum-sr">{n} star{n > 1 ? 's' : ''}</span>
        </label>
      ))}
    </span>
  );
}
