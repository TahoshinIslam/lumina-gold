export default function LoadingDashboard() {
  return (
    <div aria-label="Loading dashboard" role="status">
      <div className="adm-skeleton adm-skeleton--page-title" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="adm-skeleton" style={{ height: 110, borderRadius: 12 }} key={i} />
        ))}
      </div>
      <div className="adm-skeleton" style={{ height: 280, borderRadius: 12 }} />
      <span className="sr-only">Loading dashboard…</span>
    </div>
  );
}
