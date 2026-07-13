import { AdminListSkeleton } from '@/features/admin/components/AdminListSkeleton';

export default function LoadingOffers() {
  return <AdminListSkeleton rows={5} toolbar={false} />;
}
