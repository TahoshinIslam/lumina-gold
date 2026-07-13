import { notFound } from 'next/navigation';
import { query } from '@/server/db/client';
import { AdminDrawer } from '@/features/admin/components/AdminDrawer';
import { CouponFormFields, type CouponFormData } from '../../../../offers/CouponForm';
import { saveCouponAction } from '../../../../actions';

export default async function EditCouponModal({
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
    <AdminDrawer
      routePath={`/admin/offers/${id}/edit`}
      title={`Edit: ${rows[0].code}`}
      description="Changes apply immediately at checkout."
      formId="coupon-form"
      action={saveCouponAction}
      submitLabel="Save changes"
    >
      <CouponFormFields coupon={rows[0]} error={error} />
    </AdminDrawer>
  );
}
