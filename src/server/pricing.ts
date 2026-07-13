/**
 * What a piece costs.
 *
 * A jeweller prices two ways, and this shop only ever honoured one of them:
 *
 *   FIXED       — the admin types a price. What you type is what is charged.
 *   RATE_BASED  — the price follows the gold rate:
 *                     (today's rate per gram × the piece's weight)
 *                   + wastage on that metal
 *                   + making charge
 *                   + stone charge
 *                 So when gold moves, every rate-based piece re-prices itself,
 *                 which is exactly what the Gold Rates screen was for.
 *
 * `pricing_mode` and `metal_rates` have existed since the first schema, but no
 * code ever read them: every price came from `fixed_price`, so the rates an
 * admin entered changed nothing at all.
 *
 * The formula lives here as ONE SQL expression, shared by the catalogue and by
 * checkout. Writing it twice — once for the listing and once for the till — is
 * how a shop ends up quoting one price and charging another.
 */

/** The rate in force for a variant's purity, today. */
const currentRate = (variant: string) => `
  (SELECT mr.rate_per_gram
     FROM metal_rates mr
    WHERE mr.purity_id = ${variant}.purity_id
      AND mr.effective_from <= NOW()
    ORDER BY mr.effective_from DESC, mr.id DESC
    LIMIT 1)`;

/**
 * The price of one variant, as a SQL expression.
 *
 * @param variant  alias of `product_variants`
 * @param price    alias of `variant_price_components`
 */
export function priceExpr(variant = 'v', price = 'pc'): string {
  return `
    CASE WHEN ${price}.pricing_mode = 'rate_based' THEN
      ROUND(
        COALESCE(${currentRate(variant)}, 0)
          * COALESCE(${variant}.metal_weight_g, 0)
          * (1 + COALESCE(${price}.wastage_percent, 0) / 100)
        + COALESCE(${price}.making_charge, 0)
        + COALESCE(${price}.stone_charge, 0)
      )
    ELSE COALESCE(${price}.fixed_price, 0) END`;
}

/**
 * The same sum in TypeScript, for a row already in hand.
 *
 * Kept beside the SQL on purpose: if one changes and the other doesn't, the
 * shop quotes one number and charges another. Any change here is a change there.
 */
export interface PriceParts {
  pricingMode: 'fixed' | 'rate_based';
  fixedPrice: number;
  ratePerGram: number | null;
  weightGrams: number | null;
  wastagePercent: number | null;
  makingCharge: number | null;
  stoneCharge: number | null;
}

export function priceOf(parts: PriceParts): number {
  if (parts.pricingMode !== 'rate_based') return Math.round(parts.fixedPrice || 0);
  const metal = (parts.ratePerGram ?? 0) * (parts.weightGrams ?? 0);
  const wastage = metal * ((parts.wastagePercent ?? 0) / 100);
  return Math.round(metal + wastage + (parts.makingCharge ?? 0) + (parts.stoneCharge ?? 0));
}
