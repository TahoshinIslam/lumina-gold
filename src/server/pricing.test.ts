import { describe, it, expect } from 'vitest';
import { priceOf, sellPriceOf } from './pricing';

describe('sellPriceOf — the markdown is IN the price', () => {
  const fixed = (fixedPrice: number) => ({
    pricingMode: 'fixed' as const, fixedPrice,
    ratePerGram: null, weightGrams: null, wastagePercent: null, makingCharge: null, stoneCharge: null,
  });

  it('subtracts the markdown, so the till charges what the shop advertised', () => {
    // The bug this locks out: shop said 10,000, checkout charged 20,000.
    expect(sellPriceOf({ ...fixed(20000), discountAmount: 10000 })).toBe(10000);
  });

  it('is the list price when there is no markdown', () => {
    expect(sellPriceOf({ ...fixed(20000), discountAmount: 0 })).toBe(20000);
    expect(sellPriceOf({ ...fixed(20000) })).toBe(20000);
  });

  it('never goes below zero — a markdown cannot mint money', () => {
    expect(sellPriceOf({ ...fixed(5000), discountAmount: 9999999 })).toBe(0);
  });

  it('applies to rate-based pieces too', () => {
    const p = sellPriceOf({
      pricingMode: 'rate_based', fixedPrice: 0,
      ratePerGram: 9000, weightGrams: 10, wastagePercent: 0, makingCharge: 0, stoneCharge: 0,
      discountAmount: 20000,
    });
    expect(p).toBe(70000); // 90,000 list − 20,000
  });
});

describe('priceOf — the money formula, in one place', () => {
  it('fixed pricing returns the typed price, rounded', () => {
    expect(priceOf({ pricingMode: 'fixed', fixedPrice: 125000, ratePerGram: null, weightGrams: null, wastagePercent: null, makingCharge: null, stoneCharge: null })).toBe(125000);
    expect(priceOf({ pricingMode: 'fixed', fixedPrice: 999.6, ratePerGram: null, weightGrams: null, wastagePercent: null, makingCharge: null, stoneCharge: null })).toBe(1000);
  });

  it('rate-based = rate × weight × (1+wastage) + making + stone', () => {
    // 9000 × 10g = 90000, +10% wastage = 99000, +5000 making +2000 stone = 106000
    expect(priceOf({
      pricingMode: 'rate_based', fixedPrice: 0,
      ratePerGram: 9000, weightGrams: 10, wastagePercent: 10, makingCharge: 5000, stoneCharge: 2000,
    })).toBe(106000);
  });

  it('reprices when the rate moves (server-computed, never client-set)', () => {
    const base = { pricingMode: 'rate_based' as const, fixedPrice: 0, weightGrams: 5, wastagePercent: 0, makingCharge: 0, stoneCharge: 0 };
    expect(priceOf({ ...base, ratePerGram: 5000 })).toBe(25000);
    expect(priceOf({ ...base, ratePerGram: 9000 })).toBe(45000); // rate up → price up
  });

  it('treats missing components as zero, never NaN or negative', () => {
    const p = priceOf({ pricingMode: 'rate_based', fixedPrice: 0, ratePerGram: null, weightGrams: null, wastagePercent: null, makingCharge: null, stoneCharge: null });
    expect(p).toBe(0);
    expect(Number.isNaN(p)).toBe(false);
  });

  it('always returns an integer (BDT has no minor unit here)', () => {
    const p = priceOf({ pricingMode: 'rate_based', fixedPrice: 0, ratePerGram: 8333.33, weightGrams: 3.7, wastagePercent: 12.5, makingCharge: 1200, stoneCharge: 0 });
    expect(Number.isInteger(p)).toBe(true);
  });
});
