import CampaignForm from '../CampaignForm';

export const dynamic = 'force-dynamic';

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <h1 className="adm-h1">New campaign</h1>
      <p className="adm-sub">Add your campaign and assign products from here.</p>
      <CampaignForm campaign={{}} error={error} />
    </>
  );
}
