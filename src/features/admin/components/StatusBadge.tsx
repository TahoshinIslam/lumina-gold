export type BadgeTone = 'ok' | 'warn' | 'err' | 'info' | 'draft';

/** Pill-style status badge. Pass a `tone` map keyed by status, or a precomputed `tone`. */
export function StatusBadge({
  status, tone, toneMap, pill,
}: {
  status: string;
  tone?: BadgeTone;
  toneMap?: Record<string, BadgeTone>;
  /** Use the dashboard's dot-leading pill style instead of the plain outline badge. */
  pill?: boolean;
}) {
  const resolved = tone ?? toneMap?.[status] ?? 'draft';
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
  const cls = pill ? `adm-badge adm-badge--dot ${resolved}` : `adm-badge ${resolved}`;
  return <span className={cls}>{label}</span>;
}
