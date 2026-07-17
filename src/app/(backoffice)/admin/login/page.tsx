import { loginAction } from '../actions';
import { ValidatedForm } from '@/features/admin/components/AdminFeedback';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; retry?: string }>;
}) {
  const { error, retry } = await searchParams;
  const throttled = error === 'throttled';
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <div className="adm-brand" style={{ border: 'none', padding: 0, marginBottom: 24 }}>
          NAHAR JEWELLERS<small>ADMIN PANEL</small>
        </div>
        {throttled ? (
          <div className="adm-error">
            Too many attempts. Please wait{retry ? ` ${Math.ceil(Number(retry) / 60)} minute(s)` : ' a few minutes'} and try again.
          </div>
        ) : error ? (
          <div className="adm-error">Wrong password — try again.</div>
        ) : null}
        <ValidatedForm action={loginAction} style={{ display: 'grid', gap: 14 }}>
          <div className="adm-field">
            <label>Email</label>
            <input type="email" name="email" autoComplete="username" autoFocus required />
          </div>
          <div className="adm-field">
            <label>Password</label>
            <input type="password" name="password" autoComplete="current-password" required />
          </div>
          <button className="adm-btn" type="submit">Enter</button>
        </ValidatedForm>
      </div>
    </div>
  );
}
