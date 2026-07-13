import Link from 'next/link';
import { buildQuery, type LinkParams } from './query';

/** Sortable `<th>` driven by URL search params. Generalized from the dashboard's SortHead. */
export function SortableHead({
  col, label, sort, dir, params, basePath, align,
}: {
  col: string; label: string; sort: string; dir: string;
  params: LinkParams; basePath: string; align?: 'right';
}) {
  const active = sort === col;
  const next = active && dir === 'asc' ? 'desc' : 'asc';
  const qs = buildQuery({ ...params, sort: col, dir: next, page: '1' });
  return (
    <th style={align === 'right' ? { textAlign: 'right' } : undefined}>
      <Link href={`${basePath}?${qs}`} className={`dash-sort ${active ? 'active' : ''}`}>
        {label}
        <span className="dash-sort-ico">{active ? (dir === 'asc' ? '↑' : '↓') : '⇅'}</span>
      </Link>
    </th>
  );
}
