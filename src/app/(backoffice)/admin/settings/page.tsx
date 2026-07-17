import { getSocialLinks } from '@/server/dal/settings';
import { ValidatedForm } from '@/features/admin/components/AdminFeedback';
import { saveSocialAction } from '../actions';

export const dynamic = 'force-dynamic';

/**
 * Settings — currently the storefront's social links. Each is a plain URL the
 * header links out to; leaving one blank hides its icon rather than pointing at
 * a bare domain. type="url" gives the inline client validation for free.
 */
export default async function AdminSettingsPage() {
  const s = await getSocialLinks();

  const fields = [
    { name: 'facebook', label: 'Facebook', value: s.facebook, placeholder: 'https://facebook.com/naharjewellers' },
    { name: 'instagram', label: 'Instagram', value: s.instagram, placeholder: 'https://instagram.com/naharjewellers' },
    { name: 'x', label: 'X (Twitter)', value: s.x, placeholder: 'https://x.com/naharjewellers' },
    { name: 'youtube', label: 'YouTube', value: s.youtube, placeholder: 'https://youtube.com/@naharjewellers' },
  ];

  return (
    <>
      <h1 className="adm-h1">Settings</h1>
      <p className="adm-sub">Social media links shown in the storefront header. Leave a field blank to hide that icon.</p>

      <div className="adm-card" style={{ maxWidth: 640 }}>
        <ValidatedForm action={saveSocialAction} className="adm-form">
          {fields.map(f => (
            <div className="adm-field" key={f.name}>
              <label>{f.label}</label>
              <input type="url" name={f.name} defaultValue={f.value} placeholder={f.placeholder} inputMode="url" />
            </div>
          ))}
          <div className="adm-form-actions">
            <button className="adm-btn" type="submit">Save links</button>
          </div>
        </ValidatedForm>
      </div>
    </>
  );
}
