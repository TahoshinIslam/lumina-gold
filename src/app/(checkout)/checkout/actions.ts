'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/server/db/client';
import { getCurrentCustomer } from '@/server/auth/customer';
import { resolveAccount, adoptGuestOrders, type AccountOutcome } from '@/server/auth/account';
import {
  priceCart, checkCoupon, totalsFor,
  type CartLineInput, type CheckoutLine, type Totals,
} from '@/server/dal/checkout';
import {
  getAddresses, getAddress, createAddress, updateAddress, deleteAddress, setDefaultAddress,
  type Address, type AddressInput,
} from '@/server/dal/addresses';
import { isPaymentMethod, type PaymentMethod } from '@/config/payments';
import { hit, clientKey, LIMITS } from '@/server/security/rateLimit';
import { deductStock, claimSerials, recordMovement } from '@/server/dal/inventory';
import type { ResultSetHeader } from 'mysql2';

/**
 * Thrown when a piece sells out between the shopper seeing it in stock and the
 * order committing. Caught by placeOrderAction's transaction, which rolls back
 * and surfaces this message — so the loser of a race gets "just sold out", not
 * a 500 and not a phantom order.
 */
class OversellError extends Error {
  constructor(name: string) {
    super(`${name} has just sold out.`);
    this.name = 'OversellError';
  }
}

// A 'use server' module may only export async functions. That includes type
// re-exports: `export type { AccountOutcome }` compiles to a RUNTIME re-export
// here and blows the whole module up with "AccountOutcome is not defined" — so
// shared types live in their own modules (@/server/auth/account,
// @/config/payments) and are imported from there.

/* ── Validation (server-side; the browser's checks are a courtesy) ─────── */

/** BD mobile: 11 digits starting 01, tolerant of +880 / spaces / dashes. */
function normalisePhone(raw: string): string {
  const digits = (raw || '').replace(/[^\d]/g, '');
  return digits.startsWith('880') ? `0${digits.slice(3)}` : digits;
}

function validateAddress(input: AddressInput): string | null {
  if (!input.name || input.name.trim().length < 2) return 'Enter the recipient’s full name.';
  if (!/^01[3-9]\d{8}$/.test(normalisePhone(input.phone))) {
    return 'Enter a valid 11-digit mobile number, e.g. 01712345678.';
  }
  if (!input.line1 || input.line1.trim().length < 4) return 'Enter the street address.';
  if (!input.city || input.city.trim().length < 2) return 'Enter the city.';
  return null;
}

function readAddress(formData: FormData): AddressInput {
  return {
    label: String(formData.get('label') || '').trim() || undefined,
    name: String(formData.get('name') || '').trim(),
    phone: normalisePhone(String(formData.get('phone') || '')),
    line1: String(formData.get('line1') || '').trim(),
    line2: String(formData.get('line2') || '').trim() || undefined,
    city: String(formData.get('city') || '').trim(),
    district: String(formData.get('district') || '').trim() || undefined,
    postcode: String(formData.get('postcode') || '').trim() || undefined,
    country: String(formData.get('country') || 'BD').trim() || 'BD',
    isDefault: formData.get('is_default') === 'on' || formData.get('is_default') === '1',
  };
}

/* ── Reading the checkout ─────────────────────────────────────────────── */

export interface CheckoutState {
  lines: CheckoutLine[];
  missing: string[];
  totals: Totals;
  addresses: Address[];
  signedIn: boolean;
  customerName: string | null;
}

/**
 * Everything the checkout page renders, priced by the server. The client owns
 * the bag (localStorage), so it hands the bag over and gets back the truth:
 * real variants, real prices, real stock.
 */
export async function getCheckoutState(items: CartLineInput[]): Promise<CheckoutState> {
  const customer = await getCurrentCustomer();
  const { lines, missing } = await priceCart(items);
  return {
    lines,
    missing,
    totals: totalsFor(lines),
    addresses: customer ? await getAddresses(customer.id) : [],
    signedIn: !!customer,
    customerName: customer?.name ?? null,
  };
}

export type ActionResult = { ok: boolean; message?: string };

/* ── The address book ─────────────────────────────────────────────────── */

/**
 * Save an address. A guest has no account to save it to yet, so this creates
 * one from the name and phone they just typed — the same rule checkout has
 * always used, kept here so "Add address" works before sign-in.
 */
export async function saveAddressAction(formData: FormData): Promise<ActionResult & { id?: number }> {
  const input = readAddress(formData);
  const problem = validateAddress(input);
  if (problem) return { ok: false, message: problem };

  const id = Number(formData.get('id')) || null;
  let customer = await getCurrentCustomer();

  if (!customer) {
    if (id) return { ok: false, message: 'Sign in to edit this address.' };
    const email = String(formData.get('email') || '').trim();
    const { userId, outcome } = await resolveAccount(input.name, input.phone, email);
    // 'existing' — a password-protected account owns that phone, so resolveAccount
    // deliberately did NOT sign them in. A phone number is not a credential.
    if (outcome === 'existing') {
      return { ok: false, message: 'An account already uses that number. Please sign in to continue.' };
    }
    await adoptGuestOrders(userId, input.phone);
    customer = await getCurrentCustomer();
    if (!customer) return { ok: false, message: 'Could not open your account. Please sign in.' };
  }

  if (id) {
    const owned = await getAddress(customer.id, id);
    if (!owned) return { ok: false, message: 'That address is no longer in your book.' };
    await updateAddress(customer.id, id, input);
    revalidatePath('/checkout');
    return { ok: true, message: 'Address updated', id };
  }

  const newId = await createAddress(customer.id, input);
  revalidatePath('/checkout');
  return { ok: true, message: 'Address saved', id: newId };
}

export async function deleteAddressAction(formData: FormData): Promise<ActionResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Nothing to remove.' };
  await deleteAddress(customer.id, id);
  revalidatePath('/checkout');
  return { ok: true, message: 'Address removed' };
}

export async function setDefaultAddressAction(formData: FormData): Promise<ActionResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, message: 'Please sign in.' };
  const id = Number(formData.get('id'));
  if (!id) return { ok: false, message: 'Nothing to set.' };
  await setDefaultAddress(customer.id, id);
  revalidatePath('/checkout');
  return { ok: true, message: 'Default address updated' };
}

/* ── Coupons ──────────────────────────────────────────────────────────── */

/** The subtotal is recomputed from the bag — a client can't claim a big one to unlock a code. */
export async function applyCouponAction(code: string, items: CartLineInput[]) {
  // Coupon codes are short and guessable ("SAVE10", "EID20"). An endpoint that
  // will check them forever is an oracle: you enumerate every live discount on
  // the site at your leisure. 15 tries per 10 minutes is plenty for a shopper
  // typing a code off an email and useless for a dictionary.
  const gate = hit(await clientKey('coupon'), LIMITS.coupon.limit, LIMITS.coupon.windowSec);
  if (!gate.ok) {
    return { ok: false as const, error: 'Too many coupon attempts. Please try again shortly.' };
  }

  const { lines } = await priceCart(items);
  const { subtotal } = totalsFor(lines);
  // Pass the customer if signed in, so the preview reflects their per-user limit
  // too — placement re-checks regardless, but this avoids quoting a discount the
  // shopper can't actually redeem.
  const customer = await getCurrentCustomer();
  return checkCoupon(code, subtotal, customer?.id);
}

/* ── Placing the order ────────────────────────────────────────────────── */

export interface PlaceOrderInput {
  items: CartLineInput[];
  addressId: number;
  /** Omitted (or equal to addressId) when billing is the same as delivery. */
  billingAddressId?: number | null;
  payment: PaymentMethod;
  couponCode?: string;
  note?: string;
  giftMessage?: string;
}

/** One line, the way an invoice prints an address. */
function formatAddress(a: Address): string {
  return [a.line1, a.line2, a.city, a.district, a.postcode].filter(Boolean).join(', ');
}

export interface PlaceOrderResult {
  ok: boolean;
  orderNo?: string;
  account?: AccountOutcome;
  error?: string;
}

/**
 * placeOrderAction — the whole sale, in one transaction.
 *
 * Writes the order, its lines, the payment record, the status history and the
 * stock movement together: either every one of them lands or none does. A
 * half-written order (stock gone, no line items) is worse than a failed one.
 *
 * Everything is a SNAPSHOT — price, jewellery spec, address, coupon, tax — so
 * the invoice is still true after an admin edits the catalogue.
 */
export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, error: 'Please add a delivery address to continue.' };

  // An order writes stock and reserves inventory. Scripted repetition is how
  // you exhaust a catalogue without ever paying for it.
  const gate = hit(await clientKey('checkout'), LIMITS.checkout.limit, LIMITS.checkout.windowSec);
  if (!gate.ok) {
    return { ok: false, error: 'Too many attempts. Please wait a moment and try again.' };
  }

  if (!input.items?.length) return { ok: false, error: 'Your bag is empty.' };
  if (!isPaymentMethod(input.payment)) {
    return { ok: false, error: 'Choose a payment method.' };
  }

  const address = await getAddress(customer.id, Number(input.addressId));
  if (!address) return { ok: false, error: 'Choose a delivery address.' };

  // Billing defaults to the delivery address — the common case, and one the
  // customer shouldn't have to state twice. A different one must still be THEIRS.
  let billing = address;
  if (input.billingAddressId && Number(input.billingAddressId) !== address.id) {
    const chosen = await getAddress(customer.id, Number(input.billingAddressId));
    if (!chosen) return { ok: false, error: 'Choose a billing address.' };
    billing = chosen;
  }

  const { lines, missing } = await priceCart(input.items);
  if (!lines.length) return { ok: false, error: 'Nothing in your bag is still available.' };
  if (missing.length) {
    return { ok: false, error: `${missing.join(', ')} is no longer available — please remove it.` };
  }

  const short = lines.find(l => !l.inStock);
  if (short) {
    return {
      ok: false,
      error: short.stock === 0
        ? `${short.name} has just sold out.`
        : `Only ${short.stock} of ${short.name} left — please lower the quantity.`,
    };
  }

  // Re-validated here, not trusted from the summary panel the client rendered.
  // customer.id enables the per-user limit — this is the authoritative check.
  const coupon = input.couponCode
    ? await checkCoupon(input.couponCode, lines.reduce((n, l) => n + l.lineTotal, 0), customer.id)
    : null;
  if (input.couponCode && !coupon?.ok) {
    return { ok: false, error: coupon?.error ?? 'That code isn’t valid.' };
  }
  const totals = totalsFor(lines, coupon?.discount ?? 0);

  const orderNo = `LUM-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  // COD is settled by the courier; a gateway would flip this to 'paid' on its
  // callback. Nothing here pretends to have taken money.
  const paymentStatus = 'pending';

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [ores] = await conn.query(
      `INSERT INTO orders (
         order_no, user_id, address_id, status, currency,
         subtotal, making_charge_total, stone_charge_total, discount_total,
         tax_total, tax_rate, shipping_total, grand_total,
         payment_method, payment_status, coupon_id, coupon_code,
         shipping_name, shipping_phone, shipping_address, shipping_label,
         shipping_city, shipping_district, shipping_postcode, shipping_country,
         billing_address, customer_note, gift_message, placed_at
       ) VALUES (?, ?, ?, 'pending', 'BDT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        orderNo, customer.id, address.id,
        totals.subtotal, totals.makingCharge, totals.stoneCharge, totals.discount,
        totals.tax, totals.taxRate, totals.shipping, totals.grandTotal,
        input.payment, paymentStatus, coupon?.couponId ?? null, coupon?.code ?? null,
        address.name, address.phone, formatAddress(address),
        address.label, address.city, address.district, address.postcode, address.country,
        // Snapshotted as text, like the shipping address: the customer may edit
        // or delete the address afterwards, and an invoice must not change.
        `${billing.name}, ${formatAddress(billing)}${billing.phone ? ` · ${billing.phone}` : ''}`,
        input.note?.trim().slice(0, 500) || null,
        input.giftMessage?.trim().slice(0, 300) || null,
      ],
    );
    const orderId = (ores as { insertId: number }).insertId;

    for (const line of lines) {
      if (!line.variantId) throw new Error(`${line.name} is no longer available.`);

      // Take the stock FIRST, atomically. The decrement only happens if the
      // stock is still there at this instant — not when priceCart read it a
      // moment ago. Two customers racing for the last piece both reach here; the
      // row lock serialises them, the first wins, and the second's guard
      // (quantity_available >= qty) fails. That failure throws, which rolls the
      // whole transaction back: no order row, no line, no half-sale. This is the
      // difference between "the shelf can't go negative" (the old GREATEST, which
      // still let both orders through) and "the second sale cannot happen".
      const took = await deductStock(conn, line.variantId, line.qty);
      if (!took) {
        throw new OversellError(line.name);
      }

      // A serial-tracked piece is claimed here too, so the exact physical ring
      // is spoken for. Not tracked → null, and quantity_available alone governs.
      const claim = await claimSerials(conn, line.variantId, line.qty, orderId);
      if (claim.tracked && claim.serials === null) {
        // quantity_available said yes but the individual pieces are gone — trust
        // the pieces. Belt and braces against the two counts disagreeing.
        throw new OversellError(line.name);
      }
      const serials = claim.tracked ? claim.serials.join(', ') : null;

      await conn.query(
        `INSERT INTO order_items (
           order_id, variant_id, serial_number, product_name, variant_sku, image_path,
           metal, purity, metal_color, size_label, metal_weight_g,
           diamond_carat, stone_count, certificate_no, certificate_issuer,
           making_charge, stone_charge, quantity, unit_price, line_total, engraving
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, line.variantId, serials, line.name, line.variantSku, line.image,
          line.metal, line.purity, line.metalColor, line.sizeLabel, line.metalWeightG,
          line.diamondCarat, line.stoneCount, line.certificateNo, line.certificateIssuer,
          line.makingCharge, line.stoneCharge, line.qty, line.unitPrice, line.lineTotal,
          line.engraving,
        ],
      );

      await recordMovement(conn, {
        variantId: line.variantId, type: 'sale', quantity: -line.qty,
        referenceType: 'order', referenceId: orderId, note: orderNo,
      });
    }

    await conn.query(
      `INSERT INTO payment_transactions (order_id, method, type, status, amount, currency)
       VALUES (?, ?, 'payment', 'pending', ?, 'BDT')`,
      [orderId, input.payment, totals.grandTotal],
    );

    if (coupon?.ok) {
      // Claim the redemption ATOMICALLY, exactly like stock. checkCoupon read
      // used_count a moment ago, outside this transaction; between then and now
      // another order could have taken the last redemption of a single-use code.
      // A blind `used_count + 1` would let both orders through — the coupon used
      // twice. The conditional guard only increments if a slot is still free, and
      // if it isn't, we throw: the customer agreed to a total that included this
      // discount, so honouring the order without it would overcharge them —
      // better to fail and let them re-checkout against the real state.
      const [claim] = await conn.query<ResultSetHeader>(
        `UPDATE coupons SET used_count = used_count + 1
          WHERE id = ? AND (usage_limit IS NULL OR used_count < usage_limit)`,
        [coupon.couponId],
      );
      if (claim.affectedRows === 0) {
        throw new Error('That code has just been fully redeemed. Please remove it and try again.');
      }
    }

    await conn.query(
      `INSERT INTO order_status_history (order_id, from_status, to_status, note)
       VALUES (?, NULL, 'pending', 'placed on the storefront')`,
      [orderId],
    );

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    return { ok: false, error: e instanceof Error ? e.message : 'Could not place your order.' };
  } finally {
    conn.release();
  }

  revalidatePath('/admin/orders');
  revalidatePath('/account/orders');
  return { ok: true, orderNo };
}
