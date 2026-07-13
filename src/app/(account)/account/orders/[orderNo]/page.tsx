import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CreditCard, FileText, MapPin, Package } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentCustomer } from '@/server/auth/customer';
import { getCustomerOrder } from '@/server/dal/orders';
import { ORDER_STATUS, PAYMENT_LABEL, TERMINAL_STATUSES, canCancel, canReturn } from '@/types/order';
import { formatPrice } from '@/types/product';
import OrderTimeline from '@/features/orders/components/OrderTimeline';
import OrderActions from '@/features/orders/components/OrderActions';
import LiveData from '@/features/shared/LiveData';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ orderNo: string }> }): Promise<Metadata> {
  const { orderNo } = await params;
  return { title: `Order ${orderNo} — Nahar Jewellers` };
}

const STAMP = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

/** Order details — the whole order as it was sold, plus where it is now. */
export default async function OrderDetail({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const customer = await getCurrentCustomer();
  if (!customer) redirect('/account/login');

  // Scoped to the owner inside the query — never "fetch by id, then check".
  const order = await getCustomerOrder(customer.id, orderNo);
  if (!order) notFound();

  const status = ORDER_STATUS[order.status];
  const n = (v: string | null) => Number(v ?? 0);
  // A finished order can't change again, so there is nothing to poll for.
  const live = !TERMINAL_STATUSES.includes(order.status) && order.status !== 'delivered';

  return (
    <div className="lum-root">
      {/* The boutique moves this order from the admin; nothing pushes that here,
          so the page asks again while it's still being made. */}
      <LiveData pollSeconds={live ? 20 : 0} />
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-cart">
          <div className="lum-orders-head">
            <div>
              <Link href="/account/orders" className="lum-link-gold">← All orders</Link>
              <h1 className="lum-h2 lum-listing-title" style={{ marginTop: 8 }}>{order.order_no}</h1>
              <div className="lum-listing-count">Placed {STAMP.format(new Date(order.placed_at))}</div>
            </div>
            <div className="lum-order-head-side">
              <span className={`lum-order-status is-${status.tone}`}>{status.label}</span>
              <Link href={`/account/orders/${order.order_no}/invoice`} className="lum-cta-ghost">
                <FileText size={15} /> Invoice
              </Link>
            </div>
          </div>

          <section className="lum-panel" style={{ marginTop: 26 }}>
            <h2 className="lum-panel-title"><Package size={17} /> Tracking</h2>
            <OrderTimeline status={order.status} history={order.history} />
          </section>

          <div className="lum-detail-grid">
            <div className="lum-checkout-main">
              {/* ── The pieces ─────────────────────────────────────────── */}
              <section className="lum-panel">
                <h2 className="lum-panel-title"><Package size={17} /> Your pieces</h2>
                <div className="lum-sum-lines" style={{ borderBottom: 0, paddingBottom: 0, marginBottom: 0 }}>
                  {order.items.map(item => (
                    <div key={item.id} className="lum-sum-line">
                      <div className="lum-sum-thumb lum-img-ph">
                        {item.image_path && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image_path} alt="" />
                        )}
                        <span className="lum-sum-qty">{item.quantity}</span>
                      </div>
                      <div className="lum-sum-body">
                        <div className="lum-sum-name">{item.product_name}</div>
                        {/* The specification as SOLD — snapshotted at checkout, so
                            it still reads true after the catalogue moves on. */}
                        <dl className="lum-spec-list">
                          {item.metal && <><dt>Metal</dt><dd>{[item.purity, item.metal_color ?? item.metal].filter(Boolean).join(' ')}</dd></>}
                          {item.size_label && <><dt>Size</dt><dd>{item.size_label}</dd></>}
                          {n(item.metal_weight_g) > 0 && <><dt>Weight</dt><dd>{item.metal_weight_g} g</dd></>}
                          {n(item.diamond_carat) > 0 && <><dt>Diamond</dt><dd>{item.diamond_carat} ct</dd></>}
                          {item.stone_count ? <><dt>Stones</dt><dd>{item.stone_count}</dd></> : null}
                          {item.certificate_no && (
                            <><dt>Certificate</dt>
                              <dd>{item.certificate_issuer ? `${item.certificate_issuer} ` : ''}{item.certificate_no}</dd></>
                          )}
                          {item.engraving && <><dt>Engraving</dt><dd>“{item.engraving}”</dd></>}
                        </dl>
                      </div>
                      <div className="lum-sum-price">{formatPrice(n(item.line_total))}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Where it goes ──────────────────────────────────────── */}
              <section className="lum-panel">
                <h2 className="lum-panel-title"><MapPin size={17} /> Shipping address</h2>
                <div className="lum-addr-head"><strong>{order.shipping_name}</strong>
                  {order.shipping_label && <span className="lum-addr-tag">{order.shipping_label}</span>}
                </div>
                <div className="lum-addr-lines">{order.shipping_address}</div>
                <div className="lum-addr-lines">
                  {[order.shipping_postcode, order.shipping_country].filter(Boolean).join(' · ')}
                </div>
                <div className="lum-addr-lines">{order.shipping_phone}</div>

                {/* Only worth the ink when it is a DIFFERENT address — repeating
                    the delivery address under a second heading tells nobody anything. */}
                {order.billing_address && !order.billing_address.includes(order.shipping_address ?? '') && (
                  <>
                    <div className="lum-addr-head" style={{ marginTop: 18 }}><strong>Billing address</strong></div>
                    <div className="lum-addr-lines">{order.billing_address}</div>
                  </>
                )}

                {order.gift_message && (
                  <p className="lum-pdp-note" style={{ marginTop: 14 }}>
                    <strong>Gift message:</strong> “{order.gift_message}”
                  </p>
                )}
                {order.customer_note && (
                  <p className="lum-pdp-note"><strong>Your note:</strong> {order.customer_note}</p>
                )}
              </section>

              {/* ── Payment ───────────────────────────────────────────── */}
              <section className="lum-panel">
                <h2 className="lum-panel-title"><CreditCard size={17} /> Payment</h2>
                <div className="lum-cart-line">
                  <span>Method</span>
                  <span>{PAYMENT_LABEL[order.payment_method] ?? order.payment_method}</span>
                </div>
                <div className="lum-cart-line">
                  <span>Status</span>
                  <span className={`lum-pay-state is-${order.payment_status}`}>{order.payment_status}</span>
                </div>
                <div className="lum-cart-line">
                  <span>Transaction</span>
                  <span>{order.transaction_id ?? '—'}</span>
                </div>
              </section>

              <OrderActions
                orderNo={order.order_no}
                cancellable={canCancel(order.status)}
                returnable={canReturn(order.status)}
              />
            </div>

            {/* ── What it cost ─────────────────────────────────────────── */}
            <aside className="lum-summary">
              <h2 className="lum-cart-summary-title">Order summary</h2>
              <div className="lum-cart-line"><span>Subtotal</span><span>{formatPrice(n(order.subtotal))}</span></div>
              {n(order.making_charge_total) > 0 && (
                <div className="lum-cart-line lum-cart-line--sub">
                  <span>Making charge (included)</span><span>{formatPrice(n(order.making_charge_total))}</span>
                </div>
              )}
              {n(order.stone_charge_total) > 0 && (
                <div className="lum-cart-line lum-cart-line--sub">
                  <span>Stone charge (included)</span><span>{formatPrice(n(order.stone_charge_total))}</span>
                </div>
              )}
              {n(order.discount_total) > 0 && (
                <div className="lum-cart-line lum-cart-line--save">
                  <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ''}</span>
                  <span>−{formatPrice(n(order.discount_total))}</span>
                </div>
              )}
              <div className="lum-cart-line">
                <span>VAT ({n(order.tax_rate)}%)</span><span>{formatPrice(n(order.tax_total))}</span>
              </div>
              <div className="lum-cart-line">
                <span>Shipping</span>
                <span>{n(order.shipping_total) === 0 ? 'Free' : formatPrice(n(order.shipping_total))}</span>
              </div>
              <div className="lum-cart-line lum-cart-total">
                <span>Total</span><span>{formatPrice(n(order.grand_total))}</span>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
