import Link from 'next/link';
import { buildQuery, type LinkParams } from './query';

/** Server-rendered pager driven entirely by URL search params — no client JS. */
export function Pagination({
  page, pageSize, total, basePath, params = {},
}: {
  page: number; pageSize: number; total: number; basePath: string; params?: LinkParams;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  if (total === 0) return null;

  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const hrefFor = (p: number) => `${basePath}?${buildQuery({ ...params, page: String(p) })}`;

  return (
    <div className="adm-pager">
      <span className="adm-pager-summary">
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong>
      </span>
      <div className="adm-pager-nav">
        <Link
          href={hrefFor(current - 1)}
          aria-disabled={current <= 1}
          className={`adm-pager-btn ${current <= 1 ? 'disabled' : ''}`}
        >
          ‹ Prev
        </Link>
        <span className="adm-pager-page">Page {current} of {pageCount}</span>
        <Link
          href={hrefFor(current + 1)}
          aria-disabled={current >= pageCount}
          className={`adm-pager-btn ${current >= pageCount ? 'disabled' : ''}`}
        >
          Next ›
        </Link>
      </div>
    </div>
  );
}
