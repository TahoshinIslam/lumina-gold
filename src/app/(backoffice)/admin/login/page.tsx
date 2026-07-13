import { loginAction } from '../actions';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <div className="adm-brand" style={{ border: 'none', padding: 0, marginBottom: 24 }}>
          NAHAR JEWELLERS<small>ADMIN PANEL</small>
        </div>
        {error && <div className="adm-error">Wrong password — try again.</div>}
        <form action={loginAction} style={{ display: 'grid', gap: 14 }}>
          <div className="adm-field">
            <label>Password</label>
            <input type="password" name="password" autoFocus required />
          </div>
          <button className="adm-btn" type="submit">Enter</button>
        </form>
      </div>
    </div>
  );
}
