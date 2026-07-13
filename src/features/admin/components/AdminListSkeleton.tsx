/** Generic loading placeholder for list pages (table + toolbar), shown by route-level loading.tsx files. */
export function AdminListSkeleton({ rows = 6, toolbar = true }: { rows?: number; toolbar?: boolean }) {
  return (
    <div aria-label="Loading" role="status">
      <div className="adm-skeleton adm-skeleton--page-title" />
      {toolbar && (
        <div className="adm-skeleton-toolbar">
          <div className="adm-skeleton adm-skeleton--field" style={{ width: 260 }} />
          <div className="adm-skeleton adm-skeleton--field" style={{ width: 110 }} />
        </div>
      )}
      <div className="adm-skeleton-table">
        {Array.from({ length: rows }).map((_, i) => (
          <div className="adm-skeleton adm-skeleton--row" key={i} />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
