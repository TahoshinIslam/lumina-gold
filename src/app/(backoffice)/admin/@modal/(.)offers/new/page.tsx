import { AdminDrawer } from '@/features/admin/components/AdminDrawer';
import { CouponFormFields } from '../../../offers/CouponForm';
import { saveCouponAction } from '../../../actions';

export default async function AddCouponModal({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AdminDrawer
      routePath="/admin/offers/new"
      title="Add Coupon"
      description="Discounts are applied at checkout."
      formId="coupon-form"
      action={saveCouponAction}
      submitLabel="Create coupon"
    >
      <CouponFormFields coupon={{}} error={error} />
    </AdminDrawer>
  );
}
