export function ProductFormSkeleton({ drawer = false }: { drawer?: boolean }) {
  const content = (
    <div className="adm-form-skeleton" aria-label="Loading product editor" role="status">
      <div className="adm-skeleton adm-skeleton--tabs" />
      {[0, 1, 2, 3].map(section => (
        <div className="adm-skeleton-section" key={section}>
          <div className="adm-skeleton adm-skeleton--label" />
          <div className="adm-skeleton-grid">
            <div className="adm-skeleton adm-skeleton--field" />
            <div className="adm-skeleton adm-skeleton--field" />
          </div>
          <div className="adm-skeleton adm-skeleton--wide" />
        </div>
      ))}
      <span className="sr-only">Loading product information…</span>
    </div>
  );

  if (!drawer) return content;
  return (
    <div className="adm-drawer adm-drawer--loading" aria-hidden="false">
      <div className="adm-drawer-head">
        <div className="adm-skeleton adm-skeleton--title" />
        <div className="adm-skeleton adm-skeleton--subtitle" />
      </div>
      <div className="adm-drawer-body">{content}</div>
    </div>
  );
}
