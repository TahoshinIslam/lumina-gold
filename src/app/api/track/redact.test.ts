import { describe, it, expect } from 'vitest';
import { redactPath } from './route';

describe('redactPath — an order number never reaches analytics', () => {
  it('collapses the order number on an account order page', () => {
    expect(redactPath('/account/orders/LUM-2026-123456')).toBe('/account/orders/:orderNo');
  });

  it('collapses it on the checkout success page', () => {
    expect(redactPath('/checkout/success/LUM-2026-123456')).toBe('/checkout/success/:orderNo');
  });

  it('leaves ordinary paths alone', () => {
    expect(redactPath('/')).toBe('/');
    expect(redactPath('/shop')).toBe('/shop');
    // A product slug is not personal — it is the whole point of product_view.
    expect(redactPath('/products/diamond-ring')).toBe('/products/diamond-ring');
    expect(redactPath('/account/orders')).toBe('/account/orders');
  });

  it('catches an order number anywhere in the path', () => {
    expect(redactPath('/some/path/LUM-2026-999999')).toBe('/some/path/:orderNo');
  });
});
