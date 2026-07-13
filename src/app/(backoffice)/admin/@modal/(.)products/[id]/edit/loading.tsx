import { ProductFormSkeleton } from '@/features/admin/components/ProductFormSkeleton';

/** Drawer-shaped skeleton, so the panel is on screen the moment Edit is clicked
 *  rather than after the product, its variants and the lookups come back. */
export default function LoadingEditProductDrawer() {
  return <ProductFormSkeleton drawer />;
}
