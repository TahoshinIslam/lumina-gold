import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserCog, KeyRound } from 'lucide-react';
import { ADMIN_COOKIE } from '@/server/auth/admin';
import { verifySession } from '@/server/auth/adminSession';
import { getAdminById } from '@/server/dal/adminUsers';
import { query } from '@/server/db/client';
import { updateProfileAction, changePasswordAction } from '../actions';

export const dynamic = 'force-dynamic';

/**
 * The admin's own account page: change your display name and email, and change
 * your password. Identity comes from the session cookie — the proxy has already
 * guaranteed a valid one to reach any /admin route, and the server actions
 * re-derive it too, so nothing here trusts a form field for WHO is editing.
 */
export default async function AdminProfilePage() {
  const jar = await cookies();
  const adminId = verifySession(jar.get(ADMIN_COOKIE)?.value);
  if (adminId === null) redirect('/admin/login');

  const admin = await getAdminById(adminId);
  if (!admin) redirect('/admin/login');

  const [role] = await query<{ name: string }>(
    `SELECT name FROM roles WHERE id = ? LIMIT 1`,
    [admin.role_id],
  );

  const lastLogin = admin.last_login_at
    ? new Date(admin.last_login_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : 'First session';

  return (
    <>
      <h1 className="adm-h1">Your Profile</h1>
      <p className="adm-sub">
        {role?.name ?? 'Admin'} · last signed in {lastLogin}
      </p>

      <div className="adm-grid2 adm-grid2--divided" style={{ alignItems: 'start', gap: 32 }}>
        {/* ── Identity ─────────────────────────────────────────────── */}
        <div>
          <h2 className="adm-h2 adm-h2--icon" style={{ fontSize: 16 }}>
            <UserCog size={16} /> Account details
          </h2>
          <div className="adm-card">
            <form action={updateProfileAction} style={{ display: 'grid', gap: 14 }}>
              <div className="adm-field">
                <label>Display name</label>
                <input name="name" defaultValue={admin.name} required />
              </div>
              <div className="adm-field">
                <label>Email (used to sign in)</label>
                <input name="email" type="email" defaultValue={admin.email} autoComplete="username" required />
              </div>
              <button className="adm-btn" type="submit">Save changes</button>
            </form>
          </div>
        </div>

        {/* ── Password ─────────────────────────────────────────────── */}
        <div>
          <h2 className="adm-h2 adm-h2--icon" style={{ fontSize: 16 }}>
            <KeyRound size={16} /> Change password
          </h2>
          <div className="adm-card">
            <form action={changePasswordAction} style={{ display: 'grid', gap: 14 }}>
              <div className="adm-field">
                <label>Current password</label>
                <input name="current_password" type="password" autoComplete="current-password" required />
              </div>
              <div className="adm-field">
                <label>New password</label>
                <input name="new_password" type="password" autoComplete="new-password" minLength={10} required />
              </div>
              <div className="adm-field">
                <label>Confirm new password</label>
                <input name="confirm_password" type="password" autoComplete="new-password" minLength={10} required />
              </div>
              <p className="adm-hint" style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
                At least 10 characters. You stay signed in after changing it.
              </p>
              <button className="adm-btn" type="submit">Update password</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
