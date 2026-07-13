/**
 * The booking shapes the storefront renders. Deliberately free of any DB
 * import: the account page is a client component, and pulling these from
 * server/dal would drag the mysql pool into the browser bundle.
 */
export type BookingStatus =
  | 'reserved' | 'pending' | 'confirmed' | 'processing' | 'ready_to_ship'
  | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded' | 'expired';

/**
 * What a customer is told their booking is doing. The DB's vocabulary is
 * warehouse language ('ready_to_ship'); this is boutique language.
 */
export const BOOKING_STATUS: Record<BookingStatus, { label: string; note: string }> = {
  reserved: { label: 'Held for you', note: 'A concierge is calling to confirm.' },
  pending: { label: 'Awaiting confirmation', note: 'We have your booking and will be in touch.' },
  confirmed: { label: 'Confirmed', note: 'Your pieces are set aside in the boutique.' },
  processing: { label: 'Being prepared', note: 'Final polish and inspection.' },
  ready_to_ship: { label: 'Ready', note: 'Ready for collection or insured delivery.' },
  shipped: { label: 'On its way', note: 'In transit to your delivery address.' },
  delivered: { label: 'Delivered', note: 'Enjoy your creation.' },
  cancelled: { label: 'Cancelled', note: 'This booking was cancelled.' },
  returned: { label: 'Returned', note: 'The piece came back to the boutique.' },
  refunded: { label: 'Refunded', note: 'Your payment was returned.' },
  expired: { label: 'Hold ended', note: 'Not confirmed in time — the pieces went back to the boutique.' },
};

export interface BookingLine {
  product_name: string;
  variant_sku: string;
  quantity: number;
  line_total: number;
}

export interface Booking {
  id: number;
  order_no: string;
  status: BookingStatus;
  reserved_until: string | null;
  grand_total: number;
  placed_at: string;
  items: BookingLine[];
}
