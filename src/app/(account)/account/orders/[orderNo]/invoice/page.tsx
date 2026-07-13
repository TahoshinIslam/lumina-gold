import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCurrentCustomer } from '@/server/auth/customer';
import { getCustomerOrder } from '@/server/dal/orders';
import InvoiceDocument from '@/features/orders/components/InvoiceDocument';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ orderNo: string }> }): Promise<Metadata> {
  const { orderNo } = await params;
  return { title: `Invoice ${orderNo} — Nahar Jewellers` };
}

/** The customer's copy. Scoped to them inside the query — never by order number alone. */
export default async function CustomerInvoice({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const customer = await getCurrentCustomer();
  if (!customer) redirect('/account/login');

  const order = await getCustomerOrder(customer.id, orderNo);
  if (!order) notFound();

  return <InvoiceDocument order={order} backHref={`/account/orders/${order.order_no}`} />;
}
