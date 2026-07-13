import Link from 'next/link';
import { query } from '@/server/db/client';
import { deleteCampaignAction, bulkDeleteCampaignsAction, toggleCampaignPublishedAction } from '../actions';
import { SortableHead } from '@/features/admin/components/SortableHead';
import { Pagination } from '@/features/admin/components/Pagination';
import { StatusFilter } from '@/features/admin/components/StatusFilter';
import { BulkActionsBar } from '@/features/admin/components/BulkActionsBar';
import { AdminActionButton, ConfirmActionButton } from '@/features/admin/components/AdminFeedback';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { DebouncedSearchInput } from '@/features/admin/components/DebouncedSearchInput';
import { Megaphone } from 'lucide-react';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;
const SORT_COLUMNS: Record<string, string> = {
  title: 'c.title', start_at: 'c.start_at', end_at: 'c.end_at', products: 'products',
};
const SECTION_LABEL: Record<string, string> = {
  home_top: 'Home Top', home_middle: 'Home Middle', home_bottom: 'Home Bottom',
};

function computeStatus(row: { is_published: number; start_at: string; end_at: string }): {
  key: 'draft' | 'scheduled' | 'active' | 'expired'; label: string; tone: 'draft' | 'info' | 'ok' | 'err';
} {
  if (!row.is_published) return { key: 'draft', label: 'Draft', tone: 'draft' };
  const now = Date.now();
  const start = new Date(row.start_at).getTime();
  const end = new Date(row.end_at).getTime();
  if (now < start) return { key: 'scheduled', label: 'Scheduled', tone: 'info' };
  if (now > end) return { key: 'expired', label: 'Expired', tone: 'err' };
  return { key: 'active', label: 'Active', tone: 'ok' };
}

export default async function AdminCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string | string[]; sort?: string; dir?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || '';
  const statuses = (Array.isArray(sp.status) ? sp.status : sp.status ? [sp.status] : [])
    .filter(s => ['draft', 'scheduled', 'active', 'expired'].includes(s));
  const sort = SORT_COLUMNS[sp.sort || ''] ? sp.sort! : 'start_at';
  const dir = sp.dir === 'asc' ? 'ASC' : 'DESC';
  const page = Math.max(1, Number(sp.page) || 1);

  const conditions: string[] = [];
  const args: (string | number)[] = [];
  if (q) { conditions.push('c.title LIKE ?'); args.push(`%${q}%`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Status is computed in JS (draft/scheduled/active/expired depend on "now"),
  // so filtering happens after the fetch rather than in SQL.
  const all = await query<{
    id: number; title: string; description: string | null; start_at: string; end_at: string;
    section: string; is_home_featured: number; is_published: number; products: number;
  }>(
    `SELECT c.id, c.title, c.description, c.start_at, c.end_at, c.section, c.is_home_featured, c.is_published,
            COUNT(cp.product_id) products
     FROM campaigns c LEFT JOIN campaign_products cp ON cp.campaign_id = c.id
     ${where}
     GROUP BY c.id
     ORDER BY ${SORT_COLUMNS[sort]} ${dir}`,
    args,
  );

  const withStatus = all.map(c => ({ ...c, status: computeStatus(c) }));
  const filtered = statuses.length ? withStatus.filter(c => statuses.includes(c.status.key)) : withStatus;
  const total = filtered.length;
  const campaigns = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const linkParams = { q, status: statuses, sort, dir: dir.toLowerCase() };
  const activeFilters = q || statuses.length;

  const bdt = (n: string) => new Date(n).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1 className="adm-h1">Campaigns</h1>
          <p className="adm-sub">Manage flash sale campaigns and promotional offers.</p>
        </div>
        <Link href="/admin/campaigns/new" className="adm-btn">+ Add campaign</Link>
      </div>

      <form className="adm-toolbar" method="get">
        <div className="adm-toolbar-search">
          <DebouncedSearchInput placeholder="Search campaigns by name…" defaultValue={q} />
        </div>
        <StatusFilter
          options={[
            { value: 'active', label: 'Active' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'expired', label: 'Expired' },
            { value: 'draft', label: 'Draft' },
          ]}
          selected={statuses}
        />
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir" value={dir.toLowerCase()} />
        <button className="adm-btn ghost sm" type="submit">Filter</button>
        {activeFilters ? <Link href="/admin/campaigns" className="adm-toolbar-reset">Reset</Link> : null}
      </form>

      {campaigns.length === 0 ? (
        activeFilters ? (
          <AdminEmptyState icon={Megaphone} title="No campaigns match these filters" />
        ) : (
          <AdminEmptyState icon={Megaphone} title="No campaigns yet"
            description="Run a flash sale or seasonal promotion by creating your first campaign."
            actionHref="/admin/campaigns/new" actionLabel="+ Add campaign" />
        )
      ) : (
        <>
          <form id="campaigns-bulk-form" action={bulkDeleteCampaignsAction} />
          <BulkActionsBar
            formId="campaigns-bulk-form"
            selectAllId="campaigns-select-all"
            label="campaign"
            actions={[
              { label: 'Delete', formAction: bulkDeleteCampaignsAction, danger: true, confirm: 'Delete the selected campaigns? This cannot be undone.' },
            ]}
          />
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-check-col"><input id="campaigns-select-all" type="checkbox" aria-label="Select all" /></th>
                <SortableHead col="title" label="Campaign Name" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/campaigns" />
                <SortableHead col="products" label="Products" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/campaigns" />
                <th>Published</th>
                <SortableHead col="start_at" label="Start Date" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/campaigns" />
                <SortableHead col="end_at" label="End Date" sort={sort} dir={dir.toLowerCase()} params={linkParams} basePath="/admin/campaigns" />
                <th>Status</th>
                <th>Section</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id}>
                  <td className="adm-check-col">
                    <input type="checkbox" form="campaigns-bulk-form" name="ids" value={c.id} aria-label={`Select ${c.title}`} />
                  </td>
                  <td>
                    <strong>{c.title}</strong>
                    {!!c.is_home_featured && <span className="adm-badge info" style={{ marginLeft: 8 }}>🏠 Home Page</span>}
                    {c.description && <div style={{ fontSize: 12, color: '#687168' }}>{c.description}</div>}
                  </td>
                  <td>{c.products}</td>
                  <td>
                    <AdminActionButton action={toggleCampaignPublishedAction} values={{ id: c.id }}
                      message={c.is_published ? 'Campaign unpublished' : 'Campaign published'}
                      className={`adm-switch ${c.is_published ? 'on' : ''}`}
                      ariaLabel={c.is_published ? 'Unpublish' : 'Publish'}>
                      <span className="sr-only">{c.is_published ? 'Unpublish' : 'Publish'}</span>
                    </AdminActionButton>
                  </td>
                  <td>{bdt(c.start_at)}</td>
                  <td>{bdt(c.end_at)}</td>
                  <td><span className={`adm-badge ${c.status.tone}`}>{c.status.label}</span></td>
                  <td>{SECTION_LABEL[c.section] || c.section}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link className="adm-btn ghost sm" href={`/admin/campaigns/${c.id}/edit`}>Edit</Link>{' '}
                    <ConfirmActionButton
                      action={deleteCampaignAction}
                      values={{ id: c.id }}
                      title={`Delete ${c.title}?`}
                      description="This campaign and its product assignments will be permanently removed. This action cannot be undone."
                      confirmLabel="Delete campaign"
                      className="adm-btn danger"
                      successMessage="Campaign deleted successfully"
                    >Delete</ConfirmActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/admin/campaigns" params={linkParams} />
    </>
  );
}
