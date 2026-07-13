import { notFound } from 'next/navigation';
import { query } from '@/server/db/client';
import { AdminDrawer } from '@/features/admin/components/AdminDrawer';
import { CampaignFormFields, type CampaignFormData } from '../../../../campaigns/CampaignForm';
import { saveCampaignAction } from '../../../../actions';

export default async function EditCampaignModal({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const rows = await query<CampaignFormData>(
    `SELECT id, title, description, start_at, end_at, section, is_home_featured, is_published
     FROM campaigns WHERE id = ?`, [Number(id)],
  );
  if (!rows[0]) notFound();

  return (
    <AdminDrawer
      routePath={`/admin/campaigns/${id}/edit`}
      title={`Edit: ${rows[0].title}`}
      description="Changes apply immediately to the storefront placement."
      formId="campaign-form"
      action={saveCampaignAction}
      submitLabel="Save changes"
    >
      <CampaignFormFields campaign={rows[0]} error={error} />
    </AdminDrawer>
  );
}
