import Link from 'next/link';
import { query } from '../../lib/db';

export const dynamic = 'force-dynamic';

const bdt = (n: number) => `৳ ${Math.round(Number(n)).toLocaleString('en-IN')}`;
const REVENUE_OK = "status NOT IN ('cancelled','returned','refunded')";
const MONTHLY_TARGET = 15_000_000; // BDT — editable later in Settings

function trend(cur: number, prev: number) {
  if (prev === 0) return { pct: cur > 0 ? 100 : 0, up: cur >= 0 };
  const pct = ((cur - prev) / prev) * 100;
  return { pct: Math.abs(Math.round(pct)), up: pct >= 0 };
}

/* ── Inline SVG area chart (no dependency) ─────────────────────────────── */
function AreaChart({ series }: { series: { date: string; revenue: number }[] }) {
  const W = 620, H = 210, P = 8;
  const max = Math.max(1, ...series.map(d => d.revenue));
  const stepX = (W - P * 2) / Math.max(1, series.length - 1);
  const y = (v: number) => H - P - (v / max) * (H - P * 2 - 14);
  const pts = series.map((d, i) => [P + i * stepX, y(d.revenue)] as const);
  const line = pts.map(([x, yy], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${yy.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1]?.[0].toFixed(1) ?? P} ${H - P} L${P} ${H - P} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="adm-chart" preserveAspectRatio="none" role="img" aria-label="Revenue, last 30 days">
      <defs>
        <linearGradient id="admFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C89B3C" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#C89B3C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#admFill)" />
      <path d={line} fill="none" stroke="#A8863D" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ── Sales-target donut ────────────────────────────────────────────────── */
function Donut({ pct }: { pct: number }) {
  const r = 62, c = 2 * Math.PI * r, filled = Math.min(100, pct);
  return (
    <svg viewBox="0 0 160 160" className="adm-donut" role="img" aria-label={`Monthly target ${pct}%`}>
      <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(200,155,60,0.15)" strokeWidth="16" />
      <circle
        cx="80" cy="80" r={r} fill="none" stroke="#C89B3C" strokeWidth="16" strokeLinecap="round"
        strokeDasharray={`${(filled / 100) * c} ${c}`} transform="rotate(-90 80 80)"
      />
      <text x="80" y="74" textAnchor="middle" className="adm-donut-pct">{pct}%</text>
      <text x="80" y="96" textAnchor="middle" className="adm-donut-lbl">of target</text>
    </svg>
  );
}

export default async function AdminOverviewPage() {
  const [
    [rev], [prevRev], [ord], [prevOrd], [cust], [pend], [invVal], [oos],
    series, top, coupons, [monthRev],
  ] = await Promise.all([
    query<{ v: number }>(`SELECT COALESCE(SUM(grand_total),0) v FROM orders WHERE ${REVENUE_OK} AND placed_at >= NOW() - INTERVAL 30 DAY`),
    query<{ v: number }>(`SELECT COALESCE(SUM(grand_total),0) v FROM orders WHERE ${REVENUE_OK} AND placed_at >= NOW() - INTERVAL 60 DAY AND placed_at < NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM orders WHERE placed_at >= NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM orders WHERE placed_at >= NOW() - INTERVAL 60 DAY AND placed_at < NOW() - INTERVAL 30 DAY`),
    query<{ total: number; recent: number }>(`SELECT COUNT(*) total, COALESCE(SUM(created_at >= NOW() - INTERVAL 30 DAY),0) recent FROM users`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM orders WHERE status IN ('pending','confirmed','processing','ready_to_ship','shipped')`),
    query<{ v: number }>(`SELECT COALESCE(SUM(pc.fixed_price * i.quantity_available),0) v FROM inventory i JOIN variant_price_components pc ON pc.variant_id = i.variant_id`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM inventory WHERE quantity_available = 0 AND availability != 'made_to_order'`),
    query<{ date: string; revenue: number }>(`SELECT DATE_FORMAT(placed_at,'%Y-%m-%d') date, COALESCE(SUM(grand_total),0) revenue FROM orders WHERE ${REVENUE_OK} AND placed_at >= NOW() - INTERVAL 29 DAY GROUP BY DATE_FORMAT(placed_at,'%Y-%m-%d') ORDER BY date`),
    query<{ name: string; sold: number; revenue: number; image: string | null }>(
      `SELECT oi.product_name name, SUM(oi.quantity) sold, SUM(oi.line_total) revenue,
              (SELECT image_path FROM product_images img JOIN product_variants v ON v.product_id = img.product_id
                WHERE v.id = oi.variant_id AND img.is_primary = 1 LIMIT 1) image
       FROM order_items oi JOIN orders o ON o.id = oi.order_id
       WHERE o.${REVENUE_OK} GROUP BY oi.product_name ORDER BY sold DESC LIMIT 6`),
    query<{ code: string; type: string; value: number; used_count: number; usage_limit: number | null; expires_at: string | null; is_active: number }>(
      `SELECT code, type, value, used_count, usage_limit, expires_at, is_active FROM coupons ORDER BY is_active DESC, expires_at ASC LIMIT 5`),
    query<{ v: number }>(`SELECT COALESCE(SUM(grand_total),0) v FROM orders WHERE ${REVENUE_OK} AND YEAR(placed_at)=YEAR(NOW()) AND MONTH(placed_at)=MONTH(NOW())`),
  ]);

  const revTrend = trend(rev.v, prevRev.v);
  const ordTrend = trend(ord.c, prevOrd.c);
  const targetPct = Math.round((monthRev.v / MONTHLY_TARGET) * 100);

  // Fill missing days with zero so the chart spans a full 30-day axis.
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const byDate = new Map(series.map(s => [String(s.date).slice(0, 10), Number(s.revenue)]));
  const full: { date: string; revenue: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = fmt(d);
    full.push({ date: key, revenue: byDate.get(key) ?? 0 });
  }
  const maxSold = Math.max(1, ...top.map(t => t.sold));

  return (
    <>
      <h1 className="adm-h1">Overview</h1>
      <p className="adm-sub">Store performance — last 30 days, live from the database.</p>

      {/* KPI cards */}
      <div className="adm-kpis">
        <KpiCard label="Total Revenue" value={bdt(rev.v)} sub="Last 30 days" trend={revTrend} tone="gold" />
        <KpiCard label="Total Orders" value={String(ord.c)} sub="Last 30 days" trend={ordTrend} tone="blue" />
        <KpiCard label="Total Customers" value={cust.total.toLocaleString('en-IN')} sub={`+${cust.recent} last 30 days`} tone="green" />
        <KpiCard label="Pending Delivery" value={String(pend.c)} sub="Awaiting fulfilment" tone="amber" />
      </div>

      {/* Sales analytic + target */}
      <div className="adm-panels">
        <div className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-card-title">Sales Analytic</h2>
            <span className="adm-card-note">Revenue · 30 days</span>
          </div>
          <div className="adm-metric-row">
            <div><span className="adm-metric-lbl">This month</span><span className="adm-metric-val">{bdt(monthRev.v)}</span></div>
            <div><span className="adm-metric-lbl">Inventory value</span><span className="adm-metric-val">{bdt(invVal.v)}</span></div>
            <div><span className="adm-metric-lbl">Out of stock</span><span className="adm-metric-val">{oos.c}</span></div>
          </div>
          <AreaChart series={full} />
        </div>

        <div className="adm-card adm-card--target">
          <div className="adm-card-head"><h2 className="adm-card-title">Sales Target</h2></div>
          <Donut pct={targetPct} />
          <div className="adm-target-legend">
            <div><span className="adm-dot adm-dot--gold" /> This month <strong>{bdt(monthRev.v)}</strong></div>
            <div><span className="adm-dot adm-dot--grey" /> Monthly target <strong>{bdt(MONTHLY_TARGET)}</strong></div>
          </div>
        </div>
      </div>

      {/* Top selling + current offers */}
      <div className="adm-panels">
        <div className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-card-title">Top Selling Products</h2>
            <Link href="/admin/products" className="adm-card-note">View all →</Link>
          </div>
          {top.length === 0 ? (
            <div className="adm-empty">No sales yet.</div>
          ) : (
            <ul className="adm-top-list">
              {top.map((t, i) => (
                <li key={t.name} className="adm-top-row">
                  <span className="adm-top-rank">{i + 1}</span>
                  <span className="adm-top-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {t.image && <img src={t.image} alt="" />}
                  </span>
                  <span className="adm-top-info">
                    <span className="adm-top-name">{t.name}</span>
                    <span className="adm-top-bar"><span style={{ width: `${(t.sold / maxSold) * 100}%` }} /></span>
                  </span>
                  <span className="adm-top-nums">
                    <strong>{t.sold} sold</strong>
                    <span>{bdt(t.revenue)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-card-title">Current Offers</h2>
            <Link href="/admin/offers" className="adm-card-note">Manage →</Link>
          </div>
          {coupons.length === 0 ? (
            <div className="adm-empty">No coupons yet.</div>
          ) : (
            <ul className="adm-offer-list">
              {coupons.map(c => {
                const expired = c.expires_at && new Date(c.expires_at) < new Date();
                const usedPct = c.usage_limit ? Math.min(100, Math.round((c.used_count / c.usage_limit) * 100)) : 0;
                return (
                  <li key={c.code} className="adm-offer-row">
                    <div className="adm-offer-top">
                      <span className="adm-offer-code">{c.code}</span>
                      <span className="adm-offer-val">
                        {c.type === 'percent' ? `${c.value}% off` : `${bdt(c.value)} off`}
                      </span>
                      <span className={`adm-badge ${expired ? 'err' : c.is_active ? 'ok' : 'warn'}`}>
                        {expired ? 'Expired' : c.is_active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="adm-offer-bar"><span style={{ width: `${usedPct}%` }} /></div>
                    <div className="adm-offer-meta">
                      Used {c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}
                      {c.expires_at ? ` · ${expired ? 'expired' : 'expires'} ${new Date(c.expires_at).toLocaleDateString()}` : ''}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function KpiCard({ label, value, sub, trend, tone }: {
  label: string; value: string; sub: string;
  trend?: { pct: number; up: boolean }; tone: string;
}) {
  return (
    <div className="adm-kpi">
      <div className={`adm-kpi-dot adm-kpi-dot--${tone}`} />
      <div className="lbl">{label}</div>
      <div className="val">{value}</div>
      <div className="sub">
        {trend && (
          <span className={`adm-kpi-trend ${trend.up ? 'up' : 'down'}`}>
            {trend.up ? '↑' : '↓'} {trend.pct}%
          </span>
        )}
        {sub}
      </div>
    </div>
  );
}
