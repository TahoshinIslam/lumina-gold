import { notFound } from 'next/navigation';
import { query } from '@/server/db/client';
import { saveCouponAction } from '../../../actions';
import { CouponFormFields, type CouponFormData } from '../../CouponForm';
import { AdminFormShell } from '@/features/admin/components/AdminFormShell';

export const dynamic = 'force-dynamic';

export default async function EditCouponPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const rows = await query<CouponFormData>(
    'SELECT id, code, type, value, min_order, usage_limit, expires_at FROM coupons WHERE id = ?', [Number(id)],
  );
  if (!rows[0]) notFound();

  return (
    <>
      <h1 className="adm-h1">Edit: {rows[0].code}</h1>
      <p className="adm-sub">Changes apply immediately at checkout.</p>
      <AdminFormShell action={saveCouponAction} submitLabel="Save changes" cancelHref="/admin/offers">
        <CouponFormFields coupon={rows[0]} error={error} />
      </AdminFormShell>
    </>
  );
}
