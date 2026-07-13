export type CouponFormData = {
  id?: number; code?: string; type?: string; value?: number;
  min_order?: number; usage_limit?: number | null; expires_at?: string | null;
};

/** Field markup only — see ProductFormFields for why this is split from the <form> tag. */
export function CouponFormFields({ coupon, error }: { coupon: CouponFormData; error?: string }) {
  const c = coupon;
  const expiresValue = c.expires_at ? new Date(c.expires_at).toISOString().slice(0, 10) : '';

  return (
    <>
      {c.id && <input type="hidden" name="id" value={c.id} />}
      {error && <div className="adm-error">Enter a code and a value greater than zero.</div>}

      <div className="adm-field">
        <label>Code</label>
        <input name="code" placeholder="EID40" defaultValue={c.code || ''} required />
      </div>
      <div className="adm-grid2">
        <div className="adm-field">
          <label>Type</label>
          <select name="type" defaultValue={c.type || 'percent'}>
            <option value="percent">Percentage off</option>
            <option value="fixed">Flat amount off</option>
          </select>
        </div>
        <div className="adm-field">
          <label>Value</label>
          <input name="value" type="number" step="0.01" min="1" defaultValue={c.value ?? ''} required />
        </div>
      </div>
      <div className="adm-field">
        <label>Min order (৳)</label>
        <input name="min_order" type="number" min="0" defaultValue={c.min_order ?? 0} />
      </div>
      <div className="adm-field">
        <label>Usage limit</label>
        <input name="usage_limit" type="number" min="0" placeholder="Unlimited" defaultValue={c.usage_limit ?? ''} />
      </div>
      <div className="adm-field">
        <label>Expires</label>
        <input name="expires_at" type="date" defaultValue={expiresValue} />
      </div>
    </>
  );
}
