/**
 * The vocabulary of an order — shared by the storefront, the account pages, the
 * invoice and the admin. Kept free of any DB import so client components can
 * use it without dragging the mysql pool into the browser bundle.
 */

export type OrderStatus =
  | 'reserved' | 'pending' | 'confirmed' | 'processing'
  | 'crafting' | 'hallmarking' | 'diamond_setting' | 'polishing' | 'quality_check' | 'packed'
  | 'ready_to_ship' | 'shipped' | 'out_for_delivery' | 'delivered'
  | 'cancelled' | 'returned' | 'refunded' | 'expired';

export type StatusTone = 'live' | 'work' | 'done' | 'dead';

export interface StatusMeta {
  label: string;
  note: string;
  tone: StatusTone;
}

/**
 * A jewellery order isn't "processing" — it is being cast, hallmarked, set,
 * polished and inspected, and the customer is told exactly that.
 */
export const ORDER_STATUS: Record<OrderStatus, StatusMeta> = {
  reserved: { label: 'Held for you', tone: 'live', note: 'A concierge is calling to confirm.' },
  pending: { label: 'Pending', tone: 'live', note: 'We have your order and are confirming it.' },
  confirmed: { label: 'Confirmed', tone: 'live', note: 'Your order is confirmed and queued for the workshop.' },
  processing: { label: 'Processing', tone: 'work', note: 'Being prepared in the boutique.' },
  crafting: { label: 'Crafting', tone: 'work', note: 'Gold is being drawn, cast and forged.' },
  hallmarking: { label: 'Hallmarking', tone: 'work', note: 'Purity is assayed and the piece is stamped.' },
  diamond_setting: { label: 'Diamond setting', tone: 'work', note: 'Every stone is set by hand.' },
  polishing: { label: 'Polishing', tone: 'work', note: 'Hand-burnished to its final lustre.' },
  quality_check: { label: 'Quality check', tone: 'work', note: 'Final inspection against your specification.' },
  packed: { label: 'Packed', tone: 'work', note: 'Boxed, sealed and ready to leave the boutique.' },
  ready_to_ship: { label: 'Ready', tone: 'work', note: 'Ready for collection or insured delivery.' },
  shipped: { label: 'Shipped', tone: 'live', note: 'In transit to your delivery address.' },
  out_for_delivery: { label: 'Out for delivery', tone: 'live', note: 'With the courier, arriving today.' },
  delivered: { label: 'Delivered', tone: 'done', note: 'Enjoy your creation.' },
  cancelled: { label: 'Cancelled', tone: 'dead', note: 'This order was cancelled.' },
  returned: { label: 'Returned', tone: 'dead', note: 'The piece came back to the boutique.' },
  refunded: { label: 'Refunded', tone: 'dead', note: 'Your payment was returned.' },
  expired: { label: 'Hold ended', tone: 'dead', note: 'Not confirmed in time — the pieces went back.' },
};

/**
 * The happy path, in order. The timeline walks this; anything that ends the
 * order early (cancelled/refunded/returned) is shown as a terminal step instead.
 */
export const ORDER_PIPELINE: OrderStatus[] = [
  'pending', 'confirmed', 'crafting', 'hallmarking', 'diamond_setting',
  'polishing', 'quality_check', 'packed', 'shipped', 'out_for_delivery', 'delivered',
];

export const TERMINAL_STATUSES: OrderStatus[] = ['cancelled', 'returned', 'refunded', 'expired'];

/** Cancelling is only fair to the workshop before a single tool has touched the gold. */
export const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'reserved'];

export function canCancel(status: OrderStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status);
}

/** A return can only be asked for once the piece is actually in the customer's hands. */
export function canReturn(status: OrderStatus): boolean {
  return status === 'delivered';
}

export const PAYMENT_LABEL: Record<string, string> = {
  cod: 'Cash on Delivery',
  stripe: 'Stripe',
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  card: 'Card',
  bank_transfer: 'Bank transfer',
  emi: 'EMI',
};
