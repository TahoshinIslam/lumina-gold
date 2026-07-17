import { query } from '@/server/db/client';
import { setEnquiryStatusAction } from '../actions';
import { AdminInlineForm } from '@/features/admin/components/AdminFeedback';
import LiveData from '@/features/shared/LiveData';

export const dynamic = 'force-dynamic';

const STAMP = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

const STATUSES = ['new', 'contacted', 'scheduled', 'completed', 'cancelled'] as const;

interface Row {
  id: number;
  kind: 'appointment' | 'bespoke';
  name: string;
  phone: string;
  email: string | null;
  boutique: string | null;
  preferred_at: string | null;
  message: string | null;
  status: (typeof STATUSES)[number];
  created_at: string;
}

/**
 * Appointment & bespoke requests.
 *
 * These had nowhere to land before — the homepage CTA was a link to itself, so
 * no request was ever made. This is where they arrive: a name, a number, and
 * what they want, newest first, with the open ones at the top.
 */
export default async function AdminAppointments() {
  const rows = await query<Row>(
    `SELECT a.id, a.kind, a.name, a.phone, a.email, a.preferred_at, a.message,
            a.status, a.created_at, w.name AS boutique
       FROM appointments a
       LEFT JOIN warehouses w ON w.id = a.boutique_id
      ORDER BY
        -- Anything still needing a reply floats to the top, whatever its age.
        FIELD(a.status, 'new', 'contacted', 'scheduled', 'completed', 'cancelled'),
        a.created_at DESC
      LIMIT 200`,
  );

  const open = rows.filter(r => r.status === 'new').length;

  return (
    <>
      <LiveData />
      <div className="adm-detail-head">
        <div>
          <h1 className="adm-h1">Appointments</h1>
          <p className="adm-sub">
            {rows.length === 0
              ? 'No requests yet.'
              : `${rows.length} request${rows.length === 1 ? '' : 's'}${open ? ` · ${open} awaiting a reply` : ''}`}
          </p>
        </div>
      </div>

      <div className="adm-card">
        {rows.length === 0 ? (
          <p className="adm-sub">
            Requests from the homepage’s “Reserve Your Appointment” form appear here.
          </p>
        ) : (
          <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Who</th><th>Request</th><th>When</th><th>Received</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.name}</strong>
                    <div className="adm-sub">
                      <a href={`tel:${r.phone}`}>{r.phone}</a>
                      {r.email && <> · <a href={`mailto:${r.email}`}>{r.email}</a></>}
                    </div>
                  </td>
                  <td>
                    <strong>{r.kind === 'bespoke' ? 'Bespoke commission' : 'Private viewing'}</strong>
                    {r.boutique && <div className="adm-sub">{r.boutique}</div>}
                    {r.message && <div className="adm-sub">“{r.message}”</div>}
                  </td>
                  <td>{r.preferred_at ? STAMP.format(new Date(r.preferred_at)) : <span className="adm-sub">No preference</span>}</td>
                  <td className="adm-sub">{STAMP.format(new Date(r.created_at))}</td>
                  <td>
                    <AdminInlineForm action={setEnquiryStatusAction} successMessage="Status updated" className="adm-inline-form">
                      <input type="hidden" name="id" value={r.id} />
                      <select name="status" defaultValue={r.status} className="adm-select">
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s[0]!.toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <button type="submit" className="adm-btn ghost">Save</button>
                    </AdminInlineForm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </>
  );
}
