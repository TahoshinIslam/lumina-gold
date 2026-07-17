import Link from 'next/link';
import { query } from '@/server/db/client';
import RevenueChart, { type Point } from './_dashboard/RevenueChart';
import {
  bdt, compact, CardHead, Donut, Gauge, SortHead, StatusPill, Trend, type Slice,
} from './_dashboard/panels';

export const dynamic = 'force-dynamic';

// `is_test = 0` on both: an order placed to check the checkout works is not
// revenue, and it is not a sale. Without this a single test order against
// production quietly inflated every figure on this page for thirty days.
const REVENUE_OK = "status NOT IN ('cancelled','returned','refunded') AND is_test = 0";
const COMPLETED = "status IN ('confirmed','processing','ready_to_ship','shipped','delivered') AND is_test = 0";
const MONTHLY_TARGET = 15_000_000; // BDT — editable later in Settings

/** Current vs the equivalent preceding window. */
function trend(cur: number, prev: number) {
  const c = Number(cur), p = Number(prev);
  if (!p) return { pct: c > 0 ? 100 : 0, up: c >= 0 };
  return { pct: Math.abs(Math.round(((c - p) / p) * 100)), up: c >= p };
}

const COUNTRY: Record<string, string> = {
  BD: 'Bangladesh', US: 'United States', GB: 'United Kingdom', IN: 'India',
  ID: 'Indonesia', RU: 'Russia', AE: 'United Arab Emirates', CA: 'Canada',
  AU: 'Australia', SG: 'Singapore', MY: 'Malaysia', SA: 'Saudi Arabia',
  DE: 'Germany', FR: 'France', PK: 'Pakistan',
};

const SOURCE_LABEL: Record<string, string> = {
  direct: 'Direct Traffic', organic: 'Organic Search', social: 'Social Media',
  referral: 'Referral Traffic', email: 'Email Campaigns',
};

const SORTABLE: Record<string, string> = {
  no: 'o.id', order: 'o.order_no', customer: 'customer',
  qty: 'qty', total: 'o.grand_total', status: 'o.status',
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminOverviewPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k][0] : sp[k]) ?? '';

  const days = Math.min(90, Math.max(7, Number(one('days')) || 8));
  const q = one('q').slice(0, 60);
  const cat = Number(one('cat')) || 0;
  const sort = SORTABLE[one('sort')] ? one('sort') : 'no';
  const dir = one('dir') === 'asc' ? 'asc' : 'desc';
  const like = `%${q}%`;

  const [
    [sales], [prevSales], [orders], [prevOrders], [visitors], [prevVisitors],
    chartRows, [monthRev], [prevMonthRev],
    catRows, [activeUsers], [prevActive], geoRows, addrRows,
    [views], [prevViews], [atc], [prevAtc], [checkout], [prevCheckout],
    [done], [prevDone], [abandoned], [prevAbandoned],
    sourceRows, orderRows, categories,
    statusLog, reviewLog, auditLog, stockLog,
  ] = await Promise.all([
    query<{ v: number }>(`SELECT COALESCE(SUM(grand_total),0) v FROM orders WHERE ${REVENUE_OK} AND placed_at >= NOW() - INTERVAL 30 DAY`),
    query<{ v: number }>(`SELECT COALESCE(SUM(grand_total),0) v FROM orders WHERE ${REVENUE_OK} AND placed_at >= NOW() - INTERVAL 60 DAY AND placed_at < NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM orders WHERE placed_at >= NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM orders WHERE placed_at >= NOW() - INTERVAL 60 DAY AND placed_at < NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(DISTINCT session_id) c FROM analytics_events WHERE created_at >= NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(DISTINCT session_id) c FROM analytics_events WHERE created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY`),

    query<{ date: string; revenue: number; orders: number }>(
      `SELECT DATE_FORMAT(placed_at,'%Y-%m-%d') date,
              COALESCE(SUM(CASE WHEN ${REVENUE_OK} THEN grand_total END),0) revenue,
              COUNT(*) orders
         FROM orders WHERE placed_at >= NOW() - INTERVAL ? DAY
        GROUP BY date ORDER BY date`, [days - 1]),
    query<{ v: number }>(`SELECT COALESCE(SUM(grand_total),0) v FROM orders WHERE ${REVENUE_OK} AND YEAR(placed_at)=YEAR(NOW()) AND MONTH(placed_at)=MONTH(NOW())`),
    query<{ v: number }>(`SELECT COALESCE(SUM(grand_total),0) v FROM orders WHERE ${REVENUE_OK} AND placed_at >= DATE_SUB(DATE_FORMAT(NOW(),'%Y-%m-01'), INTERVAL 1 MONTH) AND placed_at < DATE_FORMAT(NOW(),'%Y-%m-01')`),

    query<{ name: string; revenue: number }>(
      `SELECT c.name, COALESCE(SUM(oi.line_total),0) revenue
         FROM order_items oi
         JOIN orders o ON o.id = oi.order_id AND o.${REVENUE_OK}
         JOIN product_variants v ON v.id = oi.variant_id
         JOIN product_categories pc ON pc.product_id = v.product_id
         JOIN categories c ON c.id = pc.category_id
        GROUP BY c.id, c.name ORDER BY revenue DESC LIMIT 5`),

    query<{ c: number }>(`SELECT COUNT(DISTINCT session_id) c FROM analytics_events WHERE created_at >= NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(DISTINCT session_id) c FROM analytics_events WHERE created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY`),
    query<{ country: string; c: number }>(
      `SELECT country, COUNT(DISTINCT session_id) c FROM analytics_events
        WHERE created_at >= NOW() - INTERVAL 30 DAY AND country IS NOT NULL
        GROUP BY country ORDER BY c DESC LIMIT 4`),
    query<{ country: string; c: number }>(
      `SELECT country, COUNT(*) c FROM addresses GROUP BY country ORDER BY c DESC LIMIT 4`),

    query<{ c: number }>(`SELECT COUNT(*) c FROM analytics_events WHERE event='product_view' AND created_at >= NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM analytics_events WHERE event='product_view' AND created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY`),
    // The `carts` table is never written — the storefront cart is localStorage
    // only — so these steps come from analytics_events, not from carts.
    query<{ c: number }>(`SELECT COUNT(*) c FROM analytics_events WHERE event='add_to_cart' AND created_at >= NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM analytics_events WHERE event='add_to_cart' AND created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(DISTINCT session_id) c FROM analytics_events WHERE path='/checkout' AND created_at >= NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(DISTINCT session_id) c FROM analytics_events WHERE path='/checkout' AND created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM orders WHERE ${COMPLETED} AND placed_at >= NOW() - INTERVAL 30 DAY`),
    query<{ c: number }>(`SELECT COUNT(*) c FROM orders WHERE ${COMPLETED} AND placed_at >= NOW() - INTERVAL 60 DAY AND placed_at < NOW() - INTERVAL 30 DAY`),
    // Abandoned = a session that added to the cart but never reached checkout.
    query<{ c: number }>(
      `SELECT COUNT(*) c FROM (
         SELECT session_id FROM analytics_events
          WHERE created_at >= NOW() - INTERVAL 30 DAY
          GROUP BY session_id
         HAVING SUM(event='add_to_cart') > 0 AND SUM(path='/checkout') = 0) t`),
    query<{ c: number }>(
      `SELECT COUNT(*) c FROM (
         SELECT session_id FROM analytics_events
          WHERE created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY
          GROUP BY session_id
         HAVING SUM(event='add_to_cart') > 0 AND SUM(path='/checkout') = 0) t`),

    query<{ source: string; c: number }>(
      `SELECT referrer_source source, COUNT(DISTINCT session_id) c FROM analytics_events
        WHERE created_at >= NOW() - INTERVAL 30 DAY GROUP BY referrer_source`),

    query<{ id: number; order_no: string; status: string; grand_total: number; customer: string; product: string | null; qty: number; image: string | null }>(
      `SELECT o.id, o.order_no, o.status, o.grand_total,
              COALESCE(u.name, o.shipping_name, 'Guest') customer,
              (SELECT oi.product_name FROM order_items oi WHERE oi.order_id=o.id ORDER BY oi.id LIMIT 1) product,
              COALESCE((SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id=o.id),0) qty,
              (SELECT img.image_path FROM order_items oi
                 JOIN product_variants v ON v.id = oi.variant_id
                 JOIN product_images img ON img.product_id = v.product_id AND img.is_primary = 1
                WHERE oi.order_id = o.id ORDER BY oi.id LIMIT 1) image
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
        WHERE (? = '' OR o.order_no LIKE ? OR u.name LIKE ? OR o.shipping_name LIKE ?)
          AND (? = 0 OR EXISTS (
                SELECT 1 FROM order_items oi
                  JOIN product_variants v ON v.id = oi.variant_id
                  JOIN product_categories pc ON pc.product_id = v.product_id
                 WHERE oi.order_id = o.id AND pc.category_id = ?))
        ORDER BY ${SORTABLE[sort]} ${dir === 'asc' ? 'ASC' : 'DESC'}
        LIMIT 6`, [q, like, like, like, cat, cat]),

    query<{ id: number; name: string }>(`SELECT id, name FROM categories WHERE is_active=1 ORDER BY name LIMIT 30`),

    query<{ at: string; order_no: string; from_status: string | null; to_status: string }>(
      `SELECT h.created_at at, o.order_no, h.from_status, h.to_status
         FROM order_status_history h JOIN orders o ON o.id = h.order_id
        ORDER BY h.created_at DESC LIMIT 6`),
    query<{ at: string; rating: number; user: string; product: string }>(
      `SELECT r.created_at at, r.rating, u.name user, p.name product
         FROM reviews r JOIN users u ON u.id = r.user_id JOIN products p ON p.id = r.product_id
        ORDER BY r.created_at DESC LIMIT 6`),
    query<{ at: string; action: string; entity_type: string }>(
      `SELECT created_at at, action, entity_type FROM audit_logs ORDER BY created_at DESC LIMIT 6`),
    query<{ at: string; product: string; quantity: number; movement_type: string }>(
      `SELECT m.created_at at, p.name product, m.quantity, m.movement_type
         FROM inventory_movements m
         JOIN product_variants v ON v.id = m.variant_id
         JOIN products p ON p.id = v.product_id
        ORDER BY m.created_at DESC LIMIT 6`),
  ]);

  /* ── Derive ───────────────────────────────────────────────────────────── */
  const salesTrend = trend(sales.v, prevSales.v);
  const orderTrend = trend(orders.c, prevOrders.c);
  const visitorTrend = trend(visitors.c, prevVisitors.c);

  const targetPct = Math.round((Number(monthRev.v) / MONTHLY_TARGET) * 100);
  const targetTrend = trend(monthRev.v, prevMonthRev.v);
  const gap = MONTHLY_TARGET - Number(monthRev.v);

  // Fill gaps so the x-axis always spans the full window.
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const byDate = new Map(chartRows.map(r => [String(r.date).slice(0, 10), r]));
  const series: Point[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const hit = byDate.get(iso(d));
    series.push({ date: iso(d), revenue: Number(hit?.revenue ?? 0), orders: Number(hit?.orders ?? 0) });
  }

  const catTotal = catRows.reduce((s, r) => s + Number(r.revenue), 0);
  const slices: Slice[] = catRows.map(r => ({ name: r.name, value: Number(r.revenue) }));

  // Visitor geo only exists behind a CDN. Locally the column is NULL, so fall
  // back to where customers actually ship — real data either way, and the panel
  // says which one it is showing.
  const geoIsVisitors = geoRows.length > 0;
  const geo = (geoIsVisitors ? geoRows : addrRows).map(r => ({
    name: COUNTRY[r.country] ?? r.country,
    c: Number(r.c),
  }));
  const geoTotal = Math.max(1, geo.reduce((s, r) => s + r.c, 0));

  const funnel = [
    { label: 'Product Views', value: Number(views.c), t: trend(views.c, prevViews.c) },
    { label: 'Add to Cart', value: Number(atc.c), t: trend(atc.c, prevAtc.c) },
    { label: 'Proceed to Checkout', value: Number(checkout.c), t: trend(checkout.c, prevCheckout.c) },
    { label: 'Completed Purchases', value: Number(done.c), t: trend(done.c, prevDone.c) },
    { label: 'Abandoned Carts', value: Number(abandoned.c), t: trend(abandoned.c, prevAbandoned.c) },
  ];
  const funnelMax = Math.max(1, ...funnel.map(f => f.value));

  const sourceTotal = Math.max(1, sourceRows.reduce((s, r) => s + Number(r.c), 0));
  const sources = ['direct', 'organic', 'social', 'referral', 'email'].map(key => {
    const hit = sourceRows.find(r => r.source === key);
    const c = Number(hit?.c ?? 0);
    return { key, label: SOURCE_LABEL[key], c, pct: Math.round((c / sourceTotal) * 100) };
  }).filter(s => s.c > 0);

  /* Recent activity — merge four real event streams into one timeline. */
  type Act = { at: Date; kind: string; text: string };
  const activity: Act[] = [
    ...statusLog.map(r => ({
      at: new Date(r.at), kind: 'order',
      text: `Order ${r.order_no} status changed${r.from_status ? ` from "${r.from_status}"` : ''} to "${r.to_status}".`,
    })),
    ...reviewLog.map(r => ({
      at: new Date(r.at), kind: 'review',
      text: `${r.user} left a ${r.rating}-star review for "${r.product}".`,
    })),
    ...auditLog.map(r => ({
      at: new Date(r.at), kind: 'audit',
      text: `${r.entity_type.replace(/_/g, ' ')} ${r.action}d by an administrator.`,
    })),
    ...stockLog.map(r => ({
      at: new Date(r.at), kind: 'stock',
      text: `"${r.product}" stock ${Number(r.quantity) < 0 ? 'decreased' : 'increased'} by ${Math.abs(Number(r.quantity))} (${r.movement_type}).`,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 6);

  const time = (d: Date) => d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' });
  const params = { ...(q && { q }), ...(cat && { cat: String(cat) }), ...(days !== 8 && { days: String(days) }) };
  const ICON: Record<string, string> = { order: '↻', review: '★', audit: '✎', stock: '◲' };

  // What a boutique actually opens the dashboard to see: what came in today, and
  // what is waiting on someone. The KPI row above is the business over time; this
  // row is the shop floor, right now.
  const [today] = await query<{ orders: number; revenue: string | null }>(
    `SELECT COUNT(*) orders, COALESCE(SUM(grand_total), 0) revenue
       FROM orders
      WHERE DATE(placed_at) = CURDATE() AND ${REVENUE_OK}`,
  );
  const [waiting] = await query<{ pending: number; cancelled: number }>(
    `SELECT
       SUM(status IN ('pending','confirmed')) pending,
       SUM(status IN ('cancelled','refunded','returned')) cancelled
     FROM orders`,
  );

  return (
    <div className="dash">
      <h1 className="adm-h1 dash-title">Dashboard</h1>

      {/* ── Today ───────────────────────────────────────────────────────── */}
      <div className="adm-stat-row">
        <Link href="/admin/orders" className="adm-stat">
          <div className="adm-stat-num">{Number(today.orders).toLocaleString('en-IN')}</div>
          <div className="adm-stat-lbl">Today’s orders</div>
        </Link>
        <div className="adm-stat">
          <div className="adm-stat-num">{bdt(Number(today.revenue ?? 0))}</div>
          <div className="adm-stat-lbl">Today’s revenue</div>
        </div>
        <Link href="/admin/orders?status=pending" className="adm-stat">
          <div className="adm-stat-num">{Number(waiting.pending ?? 0).toLocaleString('en-IN')}</div>
          <div className="adm-stat-lbl">Awaiting the workshop</div>
        </Link>
        <Link href="/admin/orders?status=cancelled" className="adm-stat">
          <div className="adm-stat-num">{Number(waiting.cancelled ?? 0).toLocaleString('en-IN')}</div>
          <div className="adm-stat-lbl">Cancelled &amp; refunded</div>
        </Link>
      </div>

      {/* ── KPI row ─────────────────────────────────────────────────────── */}
      <div className="dash-kpis">
        <Kpi label="Total Sales" value={bdt(sales.v)} t={salesTrend} icon="৳" featured />
        <Kpi label="Total Orders" value={Number(orders.c).toLocaleString('en-IN')} t={orderTrend} icon="⌂" />
        <Kpi label="Total Visitors" value={Number(visitors.c).toLocaleString('en-IN')} t={visitorTrend} icon="◎" />
      </div>

      {/* ── Top Categories ──────────────────────────────────────────────── */}
      <section className="adm-card dash-cats">
        <CardHead title="Top Categories" right={<Link href="/admin/categories" className="adm-card-note">See All</Link>} />
        {catTotal === 0 ? (
          <div className="adm-empty">No category sales yet.</div>
        ) : (
          <>
            <Donut slices={slices} total={catTotal} />
            <ul className="dash-legend">
              {slices.map((s, i) => (
                <li key={s.name}>
                  <span className="dash-dot" style={{ background: `var(--cat-${i + 1})` }} />
                  <span className="dash-legend-name">{s.name}</span>
                  <span className="dash-legend-val">{compact(s.value)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* ── Revenue Analytics ───────────────────────────────────────────── */}
      <section className="adm-card dash-rev">
        <CardHead
          title="Revenue Analytics"
          right={
            <div className="dash-range">
              {[8, 30, 90].map(d => (
                <Link
                  key={d}
                  href={`/admin?${new URLSearchParams({ ...params, days: String(d) })}`}
                  className={days === d ? 'active' : ''}
                >
                  Last {d} Days
                </Link>
              ))}
            </div>
          }
        />
        <div className="dash-series-key">
          <span><i className="key-solid" /> Revenue</span>
          <span><i className="key-dash" /> Order</span>
        </div>
        <RevenueChart series={series} />
      </section>

      {/* ── Monthly Target ──────────────────────────────────────────────── */}
      <section className="adm-card dash-target">
        <CardHead title="Monthly Target" />
        <Gauge pct={targetPct} />
        <div className="dash-gauge-val">{targetPct}%</div>
        <div className="dash-gauge-sub">
          <Trend {...targetTrend} /> from last month
        </div>
        <p className="dash-target-note">
          {targetPct >= 100 ? <><strong>Target met 🎉</strong><br />You are {bdt(-gap)} over target this month.</>
            : <><strong>{targetPct >= 70 ? 'Great progress! 🎉' : 'Keep pushing.'}</strong><br />{bdt(gap)} left to reach this month&apos;s target.</>}
        </p>
        <div className="dash-target-split">
          <div><span>Target</span><strong>{compact(MONTHLY_TARGET)}</strong></div>
          <div><span>Revenue</span><strong>{compact(Number(monthRev.v))}</strong></div>
        </div>
      </section>

      {/* ── Active User ─────────────────────────────────────────────────── */}
      <section className="adm-card dash-active">
        <CardHead title="Active User" />
        <div className="dash-active-top">
          <div>
            <div className="dash-big">{Number(activeUsers.c).toLocaleString('en-IN')}</div>
            <span className="dash-muted">Sessions · 30 days</span>
          </div>
          <div className="dash-active-tr">
            <Trend {...trend(activeUsers.c, prevActive.c)} />
            <span className="dash-muted">from last month</span>
          </div>
        </div>
        <span className="dash-muted dash-geo-note">
          {geoIsVisitors ? 'By visitor country' : 'By shipping country — no visitor geo yet'}
        </span>
        {geo.length === 0 ? (
          <div className="adm-empty">No sessions recorded yet.</div>
        ) : (
          <ul className="dash-geo">
            {geo.map(g => (
              <li key={g.name}>
                <div className="dash-geo-row">
                  <span>{g.name}</span>
                  <strong>{Math.round((g.c / geoTotal) * 100)}%</strong>
                </div>
                <span className="dash-bar"><span style={{ width: `${(g.c / geoTotal) * 100}%` }} /></span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Conversion Rate ─────────────────────────────────────────────── */}
      <section className="adm-card dash-conv">
        <CardHead title="Conversion Rate" right={<span className="adm-card-note">Last 30 days</span>} />
        <div className="dash-funnel">
          {funnel.map(f => (
            <div key={f.label} className="dash-funnel-col">
              <span className="dash-funnel-lbl">{f.label}</span>
              <span className="dash-funnel-val">{f.value.toLocaleString('en-IN')}</span>
              <Trend {...f.t} />
              <div className="dash-funnel-bar" style={{ height: `${Math.max(6, (f.value / funnelMax) * 100)}%` }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Traffic Sources ─────────────────────────────────────────────── */}
      <section className="adm-card dash-traffic">
        <CardHead title="Traffic Sources" />
        {sources.length === 0 ? (
          <div className="adm-empty">No traffic recorded yet.</div>
        ) : (
          <>
            <div className="dash-stack">
              {sources.map((s, i) => (
                <span key={s.key} style={{ width: `${s.pct}%`, background: `var(--cat-${i + 1})` }} title={`${s.label} ${s.pct}%`} />
              ))}
            </div>
            <ul className="dash-legend">
              {sources.map((s, i) => (
                <li key={s.key}>
                  <span className="dash-dot" style={{ background: `var(--cat-${i + 1})` }} />
                  <span className="dash-legend-name">{s.label}</span>
                  <span className="dash-legend-val">{s.pct}%</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* ── Recent Orders ───────────────────────────────────────────────── */}
      <section className="adm-card dash-orders">
        <div className="adm-card-head dash-orders-head">
          <h2 className="adm-card-title">Recent Orders</h2>
          <form className="dash-orders-tools" action="/admin">
            {days !== 8 && <input type="hidden" name="days" value={days} />}
            <input className="dash-search" type="search" name="q" defaultValue={q} placeholder="Search product, customer, etc" />
            <select className="dash-select" name="cat" defaultValue={String(cat)}>
              <option value="0">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button className="adm-btn sm" type="submit">Filter</button>
          </form>
        </div>

        {orderRows.length === 0 ? (
          <div className="adm-empty">{q || cat ? 'No orders match this filter.' : 'No orders yet.'}</div>
        ) : (
          <div className="adm-table-wrap">
          <table className="adm-table dash-table">
            <thead>
              <tr>
                <SortHead col="no" label="No" sort={sort} dir={dir} params={params} />
                <SortHead col="order" label="Order ID" sort={sort} dir={dir} params={params} />
                <SortHead col="customer" label="Customer" sort={sort} dir={dir} params={params} />
                <th>Product</th>
                <SortHead col="qty" label="Qty" sort={sort} dir={dir} params={params} />
                <SortHead col="total" label="Total" sort={sort} dir={dir} params={params} />
                <SortHead col="status" label="Status" sort={sort} dir={dir} params={params} />
              </tr>
            </thead>
            <tbody>
              {orderRows.map((o, i) => (
                <tr key={o.id}>
                  <td>{i + 1}</td>
                  <td><Link href={`/admin/orders?q=${o.order_no}`} className="dash-link">#{o.order_no}</Link></td>
                  <td>{o.customer}</td>
                  <td>
                    <span className="dash-prod">
                      <span className="adm-top-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {o.image && <img src={o.image} alt="" />}
                      </span>
                      {o.product ?? '—'}
                    </span>
                  </td>
                  <td>{o.qty}</td>
                  <td>{bdt(o.grand_total)}</td>
                  <td><StatusPill status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>

      {/* ── Recent Activity ─────────────────────────────────────────────── */}
      <section className="adm-card dash-activity">
        <CardHead title="Recent Activity" />
        {activity.length === 0 ? (
          <div className="adm-empty">Nothing yet.</div>
        ) : (
          <ul className="dash-feed">
            {activity.map((a, i) => (
              <li key={i}>
                <span className={`dash-feed-ico ${a.kind}`}>{ICON[a.kind]}</span>
                <span className="dash-feed-body">
                  <span className="dash-feed-text">{a.text}</span>
                  <span className="dash-feed-time">{time(a.at)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="dash-footer">
        <span>Copyright © {new Date().getFullYear()} Nahar Jewellers</span>
        <nav>
          <Link href="/client-services">Privacy Policy</Link>
          <Link href="/client-services">Terms and conditions</Link>
          <Link href="/boutiques">Contact</Link>
        </nav>
      </footer>
    </div>
  );
}

function Kpi({ label, value, t, icon, featured }: {
  label: string; value: string; t: { pct: number; up: boolean }; icon: string; featured?: boolean;
}) {
  return (
    <div className={`adm-kpi dash-kpi ${featured ? 'featured' : ''}`}>
      <div className="dash-kpi-head">
        <span className="lbl">{label}</span>
        <span className="dash-kpi-ico">{icon}</span>
      </div>
      <div className="dash-kpi-row">
        <span className="val">{value}</span>
        <span className="dash-kpi-tr">
          <Trend {...t} />
          <small>vs last month</small>
        </span>
      </div>
    </div>
  );
}
