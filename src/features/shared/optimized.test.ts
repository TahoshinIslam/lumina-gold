import { describe, it, expect } from 'vitest';
import { optimized } from './optimized';

const widthOf = (url?: string) => url?.match(/[&?]w=(\d+)/)?.[1];

describe('optimized — routes uploads through the Next image optimizer', () => {
  it('rewrites an /uploads path to the optimizer endpoint', () => {
    const url = optimized('/uploads/products/x.jpg', 828);
    expect(url).toContain('/_next/image?url=');
    expect(url).toContain(encodeURIComponent('/uploads/products/x.jpg'));
    expect(url).toContain('q=75');
  });

  it('snaps the width to a size the optimizer will actually serve', () => {
    // Next's optimizer 400s on any width outside deviceSizes ∪ imageSizes, so an
    // arbitrary painted width must snap UP to the nearest allowed one.
    expect(widthOf(optimized('/uploads/x.jpg', 160))).toBe('256'); // thumb → imageSizes
    expect(widthOf(optimized('/uploads/x.jpg', 128))).toBe('128'); // exact
    expect(widthOf(optimized('/uploads/x.jpg', 560))).toBe('640'); // → deviceSizes
    expect(widthOf(optimized('/uploads/x.jpg', 1280))).toBe('1920'); // between → up
    expect(widthOf(optimized('/uploads/x.jpg', 3000))).toBe('2048'); // clamps to max
  });

  it('leaves non-upload sources untouched (absolute URLs, shipped stills)', () => {
    expect(optimized('https://cdn.example/a.jpg', 828)).toBe('https://cdn.example/a.jpg');
    expect(optimized('/img/shipped-still.jpg', 828)).toBe('/img/shipped-still.jpg');
  });

  it('lifts a ?v= cache-buster out of the inner url (the optimizer rejects a query there)', () => {
    const url = optimized('/uploads/categories/rings.jpg?v=123', 640);
    // The inner url must be the clean path; the version rides as an outer param.
    expect(url).toContain(encodeURIComponent('/uploads/categories/rings.jpg'));
    expect(url).not.toContain(encodeURIComponent('rings.jpg?v=123'));
    expect(url).toContain('v=123');
  });

  it('returns undefined for no source', () => {
    expect(optimized(undefined, 828)).toBeUndefined();
  });
});
