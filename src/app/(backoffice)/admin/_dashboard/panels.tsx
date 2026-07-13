import Link from 'next/link';

/* Shared presentational pieces for the dashboard. Server components — no state,
 * just SVG and markup. The one interactive panel is RevenueChart. */

export const bdt = (n: number) => `৳ ${Math.round(Number(n)).toLocaleString('en-IN')}`;
export const compact = (n: number) =>
  n >= 1_000_000 ? `৳ ${(n / 1_000_000).toFixed(1)}M` : bdt(n);

export function Trend({ pct, up }: { pct: number; up: boolean }) {
  return (
    <span className={`dash-trend ${up ? 'up' : 'down'}`}>
      {up ? '+' : '−'}{Math.abs(pct)}%
    </span>
  );
}

export function CardHead({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="adm-card-head">
      <h2 className="adm-card-title">{title}</h2>
      {right}
    </div>
  );
}

/* ── Half-circle gauge (Monthly Target) ──────────────────────────────────── */
export function Gauge({ pct }: { pct: number }) {
  const r = 78, cx = 100, cy = 100, sw = 22;
  const clamped = Math.max(0, Math.min(100, pct));
  const semi = Math.PI * r;                       // arc length of a half circle
  const angle = Math.PI * (clamped / 100);        // 0..π
  const nx = cx - r * Math.cos(angle);
  const ny = cy - r * Math.sin(angle);

  return (
    <svg viewBox="0 0 200 128" className="dash-gauge" role="img" aria-label={`Monthly target ${pct}%`}>
      <path
        d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="var(--gold-soft)" strokeWidth={sw} strokeLinecap="round"
      />
      <path
        d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="var(--gold-primary)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${(clamped / 100) * semi} ${semi}`}
      />
      {/* Needle tip marking the current position on the arc. */}
      <circle cx={nx} cy={ny} r="6" fill="#fff" stroke="var(--gold-hover)" strokeWidth="3" />
    </svg>
  );
}

/* ── Donut (Top Categories) ──────────────────────────────────────────────── */
export type Slice = { name: string; value: number };

export function Donut({ slices, total }: { slices: Slice[]; total: number }) {
  const r = 62, c = 2 * Math.PI * r;
  const sum = Math.max(1, total);

  // Each arc starts where the previous ones ended, so carry a running offset.
  const arcs = slices.reduce<{ name: string; len: number; offset: number }[]>((acc, s) => {
    const prev = acc[acc.length - 1];
    const offset = prev ? prev.offset + prev.len : 0;
    return [...acc, { name: s.name, len: (s.value / sum) * c, offset }];
  }, []);

  return (
    <svg viewBox="0 0 160 160" className="dash-donut" role="img" aria-label="Revenue by category">
      <circle cx="80" cy="80" r={r} fill="none" stroke="var(--surface-secondary)" strokeWidth="18" />
      {arcs.map((a, i) => {
        // Trim each arc slightly so neighbouring slices read as separate.
        const shown = Math.max(0, a.len - 3);
        return (
          <circle
            key={a.name}
            cx="80" cy="80" r={r} fill="none"
            stroke={`var(--cat-${i + 1})`}
            strokeWidth="18" strokeLinecap="round"
            strokeDasharray={`${shown} ${c - shown}`}
            strokeDashoffset={-a.offset}
            transform="rotate(-90 80 80)"
          />
        );
      })}
      <text x="80" y="74" textAnchor="middle" className="dash-donut-lbl">Total Sales</text>
      <text x="80" y="98" textAnchor="middle" className="dash-donut-val">{compact(total)}</text>
    </svg>
  );
}

/* ── Status pill for the orders table ────────────────────────────────────── */
const STATUS_TONE: Record<string, string> = {
  delivered: 'ok', shipped: 'info', ready_to_ship: 'info',
  processing: 'warn', confirmed: 'warn', pending: 'err',
  cancelled: 'draft', returned: 'draft', refunded: 'draft',
};

export function StatusPill({ status }: { status: string }) {
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
  return <span className={`adm-badge adm-badge--dot ${STATUS_TONE[status] ?? 'draft'}`}>{label}</span>;
}

/* ── Sortable column header ──────────────────────────────────────────────── */
export function SortHead({ col, label, sort, dir, params }: {
  col: string; label: string; sort: string; dir: string; params: Record<string, string>;
}) {
  const active = sort === col;
  const next = active && dir === 'asc' ? 'desc' : 'asc';
  const qs = new URLSearchParams({ ...params, sort: col, dir: next });
  return (
    <th>
      <Link href={`/admin?${qs}`} className={`dash-sort ${active ? 'active' : ''}`}>
        {label}
        <span className="dash-sort-ico">{active ? (dir === 'asc' ? '↑' : '↓') : '⇅'}</span>
      </Link>
    </th>
  );
}
