import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentCustomer } from '@/server/auth/customer';
import { getCustomerOrder } from '@/server/dal/orders';
import { ORDER_STATUS, PAYMENT_LABEL } from '@/types/order';
import { formatPrice } from '@/types/product';

export const metadata: Metadata = { title: 'Order placed — Nahar Jewellers' };
export const dynamic = 'force-dynamic';

/**
 * Order success. Reads the order back from the database rather than trusting
 * anything handed over in the URL — so this page can only ever show a real
 * order, and only to the person who placed it.
 */
export default async function OrderSuccess({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const customer = await getCurrentCustomer();
  if (!customer) redirect('/account/login');

  const order = await getCustomerOrder(customer.id, orderNo);
  if (!order) notFound();

  const status = ORDER_STATUS[order.status];

  return (
    <div className="lum-root">
      <Header variant="shop" />
      <main className="lum-page-main">
        <div className="lum-cart" style={{ textAlign: 'center' }}>
          <div className="lum-breathe-diamond" style={{ width: 22, height: 22, margin: '0 auto 24px' }} />
          <h1 className="lum-h2 lum-listing-title">Thank you, {order.shipping_name?.split(' ')[0]}</h1>
          <p className="lum-pdp-desc" style={{ maxWidth: 540, margin: '6px auto 0' }}>
            Order <strong>{order.order_no}</strong> is placed. {status.note}
          </p>

          <div className="lum-success-card">
            <div className="lum-cart-line"><span>Total</span><span>{formatPrice(Number(order.grand_total))}</span></div>
            <div className="lum-cart-line">
              <span>Payment</span>
              <span>{PAYMENT_LABEL[order.payment_method] ?? order.payment_method}</span>
            </div>
            <div className="lum-cart-line">
              <span>Delivering to</span>
              <span>{order.shipping_city ?? order.shipping_address}</span>
            </div>
            <p className="lum-pdp-note" style={{ marginTop: 14 }}>
              Pay the courier in cash when your piece arrives. Please have the exact amount ready.
            </p>
          </div>

          <div style={{ marginTop: 28, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/account/orders/${order.order_no}`} className="lum-cta-gold">Track your order</Link>
            <Link href="/shop" className="lum-cta-ghost">Continue browsing</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
