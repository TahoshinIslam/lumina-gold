import { AdminListSkeleton } from '@/features/admin/components/AdminListSkeleton';

export default function LoadingRates() {
  return <AdminListSkeleton rows={5} toolbar={false} />;
}
