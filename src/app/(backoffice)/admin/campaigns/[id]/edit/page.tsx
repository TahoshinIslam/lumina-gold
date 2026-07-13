import { notFound } from 'next/navigation';
import { query } from '@/server/db/client';
import CampaignForm, { type CampaignFormData } from '../../CampaignForm';

export const dynamic = 'force-dynamic';

export default async function EditCampaignPage({
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
    <>
      <h1 className="adm-h1">Edit: {rows[0].title}</h1>
      <p className="adm-sub">Changes apply immediately to the storefront placement.</p>
      <CampaignForm campaign={rows[0]} error={error} />
    </>
  );
}
