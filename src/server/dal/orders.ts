import { query } from '@/server/db/client';
import type { OrderStatus } from '@/types/order';

/**
 * Orders as the CUSTOMER sees them. Everything here reads the snapshot columns
 * written at checkout (see 009_orders_commerce.sql) and never re-joins the live
 * catalogue — an order must still describe what was actually bought after an
 * admin edits the product, changes its price, or retires the variant.
 */

export interface OrderItemRow {
  id: number;
  product_name: string;
  variant_sku: string;
  image_path: string | null;
  metal: string | null;
  purity: string | null;
  metal_color: string | null;
  size_label: string | null;
  metal_weight_g: string | null;
  diamond_carat: string | null;
  stone_count: number | null;
  certificate_no: string | null;
  certificate_issuer: string | null;
  making_charge: string;
  stone_charge: string;
  quantity: number;
  unit_price: string;
  line_total: string;
  engraving: string | null;
}

export interface OrderRow {
  id: number;
  order_no: string;
  status: OrderStatus;
  /** Placed to check the checkout works — excluded from revenue and the funnel. */
  is_test: number;
  payment_method: string;
  payment_status: string;
  currency: string;
  subtotal: string;
  making_charge_total: string;
  stone_charge_total: string;
  discount_total: string;
  tax_total: string;
  tax_rate: string;
  shipping_total: string;
  grand_total: string;
  coupon_code: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  shipping_label: string | null;
  shipping_city: string | null;
  shipping_district: string | null;
  shipping_postcode: string | null;
  shipping_country: string | null;
  billing_address: string | null;
  customer_note: string | null;
  gift_message: string | null;
  placed_at: string;
}

export interface OrderEvent {
  to_status: OrderStatus;
  note: string | null;
  changed_by: number | null;
  created_at: string;
}

export interface OrderDetail extends OrderRow {
  items: OrderItemRow[];
  history: OrderEvent[];
  transaction_id: string | null;
}

/** A row in the My Orders list — enough to render a card, no more. */
export interface OrderSummaryRow extends Pick<OrderRow,
  'id' | 'order_no' | 'status' | 'payment_method' | 'payment_status' | 'grand_total' | 'placed_at'> {
  item_count: number;
  thumbnail: string | null;
  first_item: string | null;
}

const ORDER_COLUMNS = `
  o.id, o.order_no, o.status, o.payment_method, o.payment_status, o.currency,
  o.subtotal, o.making_charge_total, o.stone_charge_total, o.discount_total,
  o.tax_total, o.tax_rate, o.shipping_total, o.grand_total, o.coupon_code,
  o.shipping_name, o.shipping_phone, o.shipping_address, o.shipping_label,
  o.shipping_city, o.shipping_district, o.shipping_postcode, o.shipping_country,
  o.billing_address, o.customer_note, o.gift_message, o.placed_at`;

export interface OrderListOptions {
  search?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

/** My Orders: searchable, filterable, paginated. */
export async function listCustomerOrders(userId: number, options: OrderListOptions = {}): Promise<{
  orders: OrderSummaryRow[];
  total: number;
  page: number;
  pages: number;
}> {
  const perPage = options.perPage ?? 10;
  const page = Math.max(1, options.page ?? 1);

  const where: string[] = ['o.user_id = ?'];
  const params: (string | number)[] = [userId];

  if (options.status && options.status !== 'all') {
    where.push('o.status = ?');
    params.push(options.status);
  }
  if (options.search?.trim()) {
    // The order number is what a customer actually has to hand; the product name
    // is what they remember. Both are searched.
    where.push(`(o.order_no LIKE ? OR EXISTS (
      SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.product_name LIKE ?))`);
    const like = `%${options.search.trim()}%`;
    params.push(like, like);
  }
  const clause = where.join(' AND ');

  const counted = await query<{ n: number }>(
    `SELECT COUNT(*) n FROM orders o WHERE ${clause}`, params,
  );
  const total = Number(counted[0]?.n ?? 0);
  const pages = Math.max(1, Math.ceil(total / perPage));
  const offset = (Math.min(page, pages) - 1) * perPage;

  const orders = await query<OrderSummaryRow>(
    `SELECT o.id, o.order_no, o.status, o.payment_method, o.payment_status,
            o.grand_total, o.placed_at,
            (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.order_id = o.id) AS item_count,
            (SELECT oi.image_path FROM order_items oi WHERE oi.order_id = o.id ORDER BY oi.id LIMIT 1) AS thumbnail,
            (SELECT oi.product_name FROM order_items oi WHERE oi.order_id = o.id ORDER BY oi.id LIMIT 1) AS first_item
       FROM orders o
      WHERE ${clause}
      ORDER BY o.placed_at DESC, o.id DESC
      LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );

  return { orders, total, page: Math.min(page, pages), pages };
}

/**
 * One order with its lines and timeline, for whoever is allowed to see it.
 *
 * The WHERE clause is the authorisation, and it is the CALLER's job to supply
 * it — a customer is scoped by user_id inside the query (never "fetch by id,
 * then check"), while the admin, already behind the admin cookie, is not.
 */
async function loadOrder(where: string, args: (string | number)[]): Promise<OrderDetail | null> {
  const rows = await query<OrderRow>(`SELECT ${ORDER_COLUMNS} FROM orders o WHERE ${where}`, args);
  const order = rows[0];
  if (!order) return null;

  const [items, history, payments] = await Promise.all([
    query<OrderItemRow>(
      `SELECT id, product_name, variant_sku, image_path, metal, purity, metal_color, size_label,
              metal_weight_g, diamond_carat, stone_count, certificate_no, certificate_issuer,
              making_charge, stone_charge, quantity, unit_price, line_total, engraving
         FROM order_items WHERE order_id = ? ORDER BY id`,
      [order.id],
    ),
    query<OrderEvent>(
      `SELECT to_status, note, changed_by, created_at
         FROM order_status_history WHERE order_id = ? ORDER BY created_at, id`,
      [order.id],
    ),
    query<{ gateway_txn_id: string | null }>(
      `SELECT gateway_txn_id FROM payment_transactions
        WHERE order_id = ? AND type = 'payment' ORDER BY id DESC LIMIT 1`,
      [order.id],
    ),
  ]);

  return { ...order, items, history, transaction_id: payments[0]?.gateway_txn_id ?? null };
}

/** The customer's own order — scoped to them inside the query. */
export function getCustomerOrder(userId: number, orderNo: string): Promise<OrderDetail | null> {
  return loadOrder('o.order_no = ? AND o.user_id = ?', [orderNo, userId]);
}

/** Any order, by id — for the admin, which the middleware has already authorised. */
export function getOrderForAdmin(id: number): Promise<OrderDetail | null> {
  return loadOrder('o.id = ?', [id]);
}
