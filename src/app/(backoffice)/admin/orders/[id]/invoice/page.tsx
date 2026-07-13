import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrderForAdmin } from '@/server/dal/orders';
import InvoiceDocument from '@/features/orders/components/InvoiceDocument';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Invoice — Nahar Jewellers' };

/**
 * The boutique's copy of the invoice.
 *
 * The admin's Invoice button used to link at the CUSTOMER's route, which is
 * scoped to a customer session — so staff were bounced to /account/login. This
 * is the same document, authorised the way the admin actually is: by the admin
 * cookie, which the proxy (src/proxy.ts) already enforces on every /admin path.
 */
export default async function AdminInvoice({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderForAdmin(Number(id));
  if (!order) notFound();

  return <InvoiceDocument order={order} backHref={`/admin/orders/${order.id}`} />;
}
