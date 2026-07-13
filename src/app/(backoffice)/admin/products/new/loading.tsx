import { ProductFormSkeleton } from '@/features/admin/components/ProductFormSkeleton';

export default function LoadingNewProduct() {
  return (
    <>
      <div className="adm-skeleton adm-skeleton--page-title" />
      <ProductFormSkeleton />
    </>
  );
}
