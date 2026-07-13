/**
 * The ways a customer can pay.
 *
 * Kept out of the checkout's 'use server' module on purpose: a "use server"
 * file may only export async functions, so a plain array living there breaks
 * the whole action module at runtime (every action silently fails to resolve).
 *
 * `live` marks what is actually settleable today. COD is; the gateways are
 * recorded as a pending payment and a concierge sends the payment request —
 * nothing here pretends to have taken money.
 */
export const PAYMENT_METHODS = ['cod', 'stripe', 'bkash', 'nagad', 'rocket', 'card'] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function isPaymentMethod(value: string): value is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}
