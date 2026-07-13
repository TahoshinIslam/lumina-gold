import { AdminDrawer } from '@/features/admin/components/AdminDrawer';
import { CampaignFormFields } from '../../../campaigns/CampaignForm';
import { saveCampaignAction } from '../../../actions';

export default async function AddCampaignModal({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AdminDrawer
      routePath="/admin/campaigns/new"
      title="Add Campaign"
      description="Add your campaign and assign products from here."
      formId="campaign-form"
      action={saveCampaignAction}
      submitLabel="Add Campaign"
    >
      <CampaignFormFields campaign={{}} error={error} />
    </AdminDrawer>
  );
}
