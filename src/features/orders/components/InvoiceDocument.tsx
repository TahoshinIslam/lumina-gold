import QRCode from 'qrcode';
import type { OrderDetail } from '@/server/dal/orders';
import { ORDER_STATUS, PAYMENT_LABEL } from '@/types/order';
import { code128 } from '@/features/orders/barcode';
import PrintButton from './PrintButton';
import './invoice.css';

const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
});
const bdt = (v: string | number | null) => `৳ ${Number(v ?? 0).toLocaleString('en-IN')}`;

/**
 * The invoice document (Phase 6) — A4, print-first.
 *
 * Deliberately NOT a generated PDF binary: the page IS the document. `@page`
 * sets the A4 box, print styles strip the chrome, and the browser's own "Save
 * as PDF" produces a selectable, searchable file with no server-side renderer to
 * keep alive. "Download PDF" and "Print" are therefore the same button.
 *
 * It takes an order that has ALREADY been loaded and authorised, because the two
 * callers are authorised differently: the customer's route scopes the query to
 * their own user_id; the admin's route is behind the admin cookie. Sharing the
 * document but not the authorisation is the whole point — the admin's Invoice
 * button used to link at the customer's route and bounce staff to a login page.
 *
 * Every figure is read from the order's snapshot columns, so an invoice printed
 * a year from now still shows the purity, weight, charges and price the customer
 * actually paid — even if the product has been re-priced or deleted since.
 */
export default async function InvoiceDocument({ order, backHref }: {
  order: OrderDetail;
  backHref: string;
}) {
  // The QR resolves to this order's tracking page — a courier or a boutique can
  // scan the paper and land on the live status.
  const trackUrl = `https://naharjewellers.com/account/orders/${order.order_no}`;
  const qr = await QRCode.toDataURL(trackUrl, {
    margin: 0, width: 220, color: { dark: '#171714', light: '#ffffff' },
  });
  const barcode = code128(order.order_no);

  const billsElsewhere = !!order.billing_address
    && !order.billing_address.includes(order.shipping_address ?? '');
  const hallmarked = order.items.some(i => i.purity);
  const totalWeight = order.items.reduce((n, i) => n + Number(i.metal_weight_g ?? 0) * i.quantity, 0);
  const totalCarat = order.items.reduce((n, i) => n + Number(i.diamond_carat ?? 0) * i.quantity, 0);

  return (
    <div className="inv-root">
      <div className="inv-bar">
        <a href={backHref} className="inv-back">← Back to order</a>
        <PrintButton />
      </div>

      <article className="inv-page">
        <header className="inv-head">
          <div className="inv-brand">
            <div className="inv-mark">✦</div>
            <div>
              <div className="inv-brand-name">NAHAR JEWELLERS</div>
              <div className="inv-brand-sub">Haute Joaillerie · Est. 1985</div>
            </div>
          </div>
          <div className="inv-title">
            <h1>INVOICE</h1>
            <dl>
              <dt>Invoice No</dt><dd>{order.order_no}</dd>
              <dt>Date</dt><dd>{DATE.format(new Date(order.placed_at))}</dd>
              <dt>Status</dt><dd>{ORDER_STATUS[order.status].label}</dd>
              <dt>Total due</dt><dd><strong>{bdt(order.grand_total)}</strong></dd>
            </dl>
          </div>
        </header>

        <section className="inv-parties">
          <div>
            <h2>Invoice to</h2>
            <p className="inv-name">{order.shipping_name}</p>
            <p>{order.shipping_address}</p>
            <p>{[order.shipping_postcode, order.shipping_country].filter(Boolean).join(' · ')}</p>
            <p>{order.shipping_phone}</p>
            {/* Printed only when billing differs — an invoice that repeats the
                same address under two headings is noise on a document people file. */}
            {billsElsewhere && (
              <>
                <h2 style={{ marginTop: 12 }}>Billed to</h2>
                <p>{order.billing_address}</p>
              </>
            )}
          </div>
          <div>
            <h2>Boutique</h2>
            <p className="inv-name">Nahar Jewellers</p>
            <p>Gulshan Avenue, Dhaka 1212, Bangladesh</p>
            <p>+880 1712 345678 · concierge@naharjewellers.com</p>
            <p>BIN 004112233-0101</p>
          </div>
        </section>

        <table className="inv-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Piece &amp; specification</th>
              <th className="num">Making</th>
              <th className="num">Stones</th>
              <th className="num">Qty</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.id}>
                <td>{String(index + 1).padStart(2, '0')}</td>
                <td>
                  <div className="inv-item-name">{item.product_name}</div>
                  <div className="inv-item-spec">
                    {[
                      [item.purity, item.metal_color ?? item.metal].filter(Boolean).join(' ') || null,
                      item.size_label ? `Size ${item.size_label}` : null,
                      Number(item.metal_weight_g ?? 0) > 0 ? `${item.metal_weight_g} g` : null,
                      Number(item.diamond_carat ?? 0) > 0 ? `${item.diamond_carat} ct` : null,
                      item.stone_count ? `${item.stone_count} stones` : null,
                      item.certificate_no
                        ? `${item.certificate_issuer ?? 'Cert'} ${item.certificate_no}` : null,
                      item.engraving ? `Engraved “${item.engraving}”` : null,
                    ].filter(Boolean).join(' · ')}
                  </div>
                  <div className="inv-item-sku">{item.variant_sku}</div>
                </td>
                <td className="num">{bdt(item.making_charge)}</td>
                <td className="num">{bdt(item.stone_charge)}</td>
                <td className="num">{String(item.quantity).padStart(2, '0')}</td>
                <td className="num">{bdt(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="inv-foot">
          <div className="inv-foot-left">
            <h2>Payment</h2>
            <dl className="inv-kv">
              <dt>Method</dt><dd>{PAYMENT_LABEL[order.payment_method] ?? order.payment_method}</dd>
              <dt>Status</dt><dd>{order.payment_status}</dd>
              <dt>Order ID</dt><dd>{order.order_no}</dd>
              {order.transaction_id && <><dt>Transaction</dt><dd>{order.transaction_id}</dd></>}
            </dl>

            {hallmarked && (
              <>
                <h2>Hallmark &amp; assay</h2>
                <dl className="inv-kv">
                  <dt>Purity</dt>
                  <dd>{[...new Set(order.items.map(i => i.purity).filter(Boolean))].join(', ')}</dd>
                  {totalWeight > 0 && <><dt>Metal weight</dt><dd>{totalWeight.toFixed(2)} g</dd></>}
                  {totalCarat > 0 && <><dt>Diamond weight</dt><dd>{totalCarat.toFixed(2)} ct</dd></>}
                  <dt>Assay</dt><dd>BSTI hallmarked, stamped at the boutique workshop</dd>
                </dl>
              </>
            )}
          </div>

          <div className="inv-foot-right">
            <dl className="inv-totals">
              <dt>Subtotal</dt><dd>{bdt(order.subtotal)}</dd>
              {Number(order.making_charge_total) > 0 && (
                <><dt>Making charge (incl.)</dt><dd>{bdt(order.making_charge_total)}</dd></>
              )}
              {Number(order.stone_charge_total) > 0 && (
                <><dt>Stone charge (incl.)</dt><dd>{bdt(order.stone_charge_total)}</dd></>
              )}
              {Number(order.discount_total) > 0 && (
                <>
                  <dt>Discount{order.coupon_code ? ` (${order.coupon_code})` : ''}</dt>
                  <dd>− {bdt(order.discount_total)}</dd>
                </>
              )}
              <dt>VAT ({Number(order.tax_rate)}%)</dt><dd>{bdt(order.tax_total)}</dd>
              <dt>Shipping</dt>
              <dd>{Number(order.shipping_total) === 0 ? 'Free' : bdt(order.shipping_total)}</dd>
            </dl>
            <div className="inv-grand">
              <span>Total</span>
              <strong>{bdt(order.grand_total)}</strong>
            </div>
          </div>
        </section>

        <section className="inv-codes">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="inv-qr" src={qr} alt={`QR code linking to order ${order.order_no}`} />
          <div className="inv-barcode">
            <svg viewBox={`-10 0 ${barcode.width + 20} ${barcode.height}`}
              role="img" aria-label={`Barcode for order ${order.order_no}`}>
              <path d={barcode.path} fill="#171714" />
            </svg>
            <div className="inv-barcode-text">{order.order_no}</div>
          </div>
          <div className="inv-terms">
            <h2>Terms</h2>
            <p>
              {order.payment_method === 'cod'
                ? 'Payment is collected in cash on delivery — please have the exact amount ready.'
                : 'Payment is due before dispatch; a secure payment link is sent by your concierge.'}
              {' '}Gold and diamond pieces are hallmarked and certified as stated above. Returns are
              accepted within 7 days of delivery, unworn and in the original box, excluding engraved
              and made-to-order pieces. Buy-back and exchange follow the prevailing gold rate on the
              day of exchange.
            </p>
            <div className="inv-sign">
              <div className="inv-sign-line" />
              Authorised signatory · Nahar Jewellers
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
