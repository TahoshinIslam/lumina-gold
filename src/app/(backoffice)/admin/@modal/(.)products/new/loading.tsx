import { ProductFormSkeleton } from '@/features/admin/components/ProductFormSkeleton';

/** Drawer-shaped skeleton, so the panel is on screen the instant it is clicked
 *  rather than after the lookups and the reserved SKU come back. */
export default function LoadingNewProductDrawer() {
  return <ProductFormSkeleton drawer />;
}
