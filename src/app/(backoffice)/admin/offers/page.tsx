import Link from 'next/link';
import { query } from '@/server/db/client';
import { toggleCouponAction, deleteCouponAction } from '../actions';
import { AdminActionButton, ConfirmActionButton } from '@/features/admin/components/AdminFeedback';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Math.round(Number(n)).toLocaleString('en-IN')}`;

export default async function AdminOffersPage() {
  const coupons = await query<{
    id: number; code: string; type: string; value: number; min_order: number;
    used_count: number; usage_limit: number | null; expires_at: string | null; is_active: number;
  }>(`SELECT id, code, type, value, min_order, used_count, usage_limit, expires_at, is_active
      FROM coupons ORDER BY is_active DESC, expires_at ASC`);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1 className="adm-h1">Offers</h1>
          <p className="adm-sub">{coupons.length} coupons · discounts applied at checkout</p>
        </div>
        <Link href="/admin/offers/new" className="adm-btn">+ Add coupon</Link>
      </div>

      {coupons.length === 0 ? (
        <AdminEmptyState icon={Tag} title="No coupons yet"
          description="Coupons apply automatic discounts at checkout — create one to run your first promotion."
          actionHref="/admin/offers/new" actionLabel="+ Add coupon" />
      ) : (
        <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>Code</th><th>Discount</th><th>Min order</th><th>Usage</th><th>Expires</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {coupons.map(c => {
              const expired = c.expires_at && new Date(c.expires_at) < new Date();
              return (
                <tr key={c.id}>
                  <td><strong style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>{c.code}</strong></td>
                  <td>{c.type === 'percent' ? `${c.value}%` : bdt(c.value)}</td>
                  <td>{c.min_order > 0 ? bdt(c.min_order) : '—'}</td>
                  <td>{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                  <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}</td>
                  <td><span className={`adm-badge ${expired ? 'err' : c.is_active ? 'ok' : 'warn'}`}>
                    {expired ? 'Expired' : c.is_active ? 'Active' : 'Paused'}
                  </span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link className="adm-btn ghost sm" href={`/admin/offers/${c.id}/edit`}>Edit</Link>{' '}
                    <AdminActionButton action={toggleCouponAction} values={{ id: c.id }}
                      message={c.is_active ? 'Coupon paused' : 'Coupon activated'}
                      className="adm-btn ghost sm">
                      {c.is_active ? 'Pause' : 'Activate'}
                    </AdminActionButton>{' '}
                    <ConfirmActionButton
                      action={deleteCouponAction}
                      values={{ id: c.id }}
                      title={`Delete ${c.code}?`}
                      description="This coupon will no longer be redeemable at checkout. This action cannot be undone."
                      confirmLabel="Delete coupon"
                      className="adm-btn danger"
                      successMessage="Coupon deleted successfully"
                    >Delete</ConfirmActionButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      )}
    </>
  );
}
