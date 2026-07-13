import { saveCouponAction } from '../../actions';
import { CouponFormFields } from '../CouponForm';
import { AdminFormShell } from '@/features/admin/components/AdminFormShell';

export const dynamic = 'force-dynamic';

export default async function NewCouponPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <h1 className="adm-h1">New coupon</h1>
      <p className="adm-sub">Discounts are applied at checkout.</p>
      <AdminFormShell action={saveCouponAction} submitLabel="Create coupon" cancelHref="/admin/offers">
        <CouponFormFields coupon={{}} error={error} />
      </AdminFormShell>
    </>
  );
}
