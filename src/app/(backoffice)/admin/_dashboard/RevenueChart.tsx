'use client';

import { useState } from 'react';

export type Point = { date: string; revenue: number; orders: number };

/**
 * Revenue (solid, filled) against order count (dashed) on a shared x-axis.
 * The two series have different units, so each is normalised to its own max —
 * the dashed line shows the *shape* of order volume, not a comparable height.
 */
export default function RevenueChart({ series }: { series: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);

  // Formatted here rather than passed in: a function prop cannot cross the
  // server/client boundary.
  const currency = (n: number) => `৳ ${Math.round(n).toLocaleString('en-IN')}`;

  const W = 640, H = 240;
  const PL = 44, PR = 12, PT = 18, PB = 28;
  const iw = W - PL - PR, ih = H - PT - PB;

  const maxRev = Math.max(1, ...series.map(d => d.revenue));
  const maxOrd = Math.max(1, ...series.map(d => d.orders));
  const step = iw / Math.max(1, series.length - 1);

  const x = (i: number) => PL + i * step;
  const yRev = (v: number) => PT + ih - (v / maxRev) * ih;
  const yOrd = (v: number) => PT + ih - (v / maxOrd) * ih;

  // Catmull-Rom → bezier, so the line curves like the reference instead of
  // kinking at every data point.
  const smooth = (pts: [number, number][]) => {
    if (pts.length < 2) return pts.length ? `M${pts[0][0]} ${pts[0][1]}` : '';
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  };

  const revPts = series.map((d, i) => [x(i), yRev(d.revenue)] as [number, number]);
  const ordPts = series.map((d, i) => [x(i), yOrd(d.orders)] as [number, number]);
  const revLine = smooth(revPts);
  const revArea = `${revLine} L${x(series.length - 1)} ${PT + ih} L${PL} ${PT + ih} Z`;

  const ticks = 4;
  const gridY = Array.from({ length: ticks + 1 }, (_, i) => PT + (ih / ticks) * i);
  const short = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : String(Math.round(n)));
  const day = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`;
  };

  const hp = hover !== null ? series[hover] : null;

  return (
    <div className="dash-chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="dash-chart" role="img" aria-label="Revenue and orders over time">
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold-primary)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="var(--gold-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridY.map((gy, i) => (
          <g key={gy}>
            <line x1={PL} y1={gy} x2={W - PR} y2={gy} stroke="var(--border-primary)" strokeWidth="1" strokeDasharray="3 4" />
            <text x={PL - 10} y={gy + 4} textAnchor="end" className="dash-axis">
              {short((maxRev / ticks) * (ticks - i))}
            </text>
          </g>
        ))}

        {hp && (
          <rect x={x(hover!) - step / 2} y={PT} width={step} height={ih} fill="var(--gold-soft)" opacity="0.55" />
        )}

        <path d={revArea} fill="url(#revFill)" />
        <path d={revLine} fill="none" stroke="var(--gold-hover)" strokeWidth="2.5" strokeLinecap="round" />
        <path d={smooth(ordPts)} fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" opacity="0.75" />

        {hp && (
          <circle cx={x(hover!)} cy={yRev(hp.revenue)} r="5" fill="#fff" stroke="var(--gold-hover)" strokeWidth="2.5" />
        )}

        {series.map((d, i) => (
          <text key={d.date} x={x(i)} y={H - 8} textAnchor="middle" className="dash-axis">
            {series.length > 12 && i % Math.ceil(series.length / 8) !== 0 ? '' : day(d.date)}
          </text>
        ))}

        {/* Invisible hit targets — one column per point. */}
        {series.map((d, i) => (
          <rect
            key={`h-${d.date}`}
            x={x(i) - step / 2} y={PT} width={step} height={ih}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>

      {hp && (
        <div
          className="dash-tip"
          style={{ left: `${(x(hover!) / W) * 100}%`, top: `${(yRev(hp.revenue) / H) * 100}%` }}
        >
          <span className="dash-tip-lbl">Revenue</span>
          <strong>{currency(hp.revenue)}</strong>
          <span className="dash-tip-sub">{hp.orders} orders · {day(hp.date)}</span>
        </div>
      )}
    </div>
  );
}
