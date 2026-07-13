/**
 * Multi-select status checklist rendered as a native <details> pill — no client
 * JS required. Must be nested inside the page's search <form method="get">;
 * checking boxes and pressing "Apply" resubmits the whole toolbar in one go.
 */
export function StatusFilter({
  name = 'status', options, selected, label = 'Status',
}: {
  name?: string;
  options: { value: string; label: string }[];
  selected: string[];
  label?: string;
}) {
  return (
    <details className="adm-filter">
      <summary>
        {label}
        {selected.length > 0 && <span className="adm-filter-count">{selected.length}</span>}
      </summary>
      <div className="adm-filter-panel">
        {options.map(o => (
          <label key={o.value}>
            <input type="checkbox" name={name} value={o.value} defaultChecked={selected.includes(o.value)} />
            {o.label}
          </label>
        ))}
        <div className="adm-filter-panel-foot">
          <button type="submit" className="adm-btn ghost sm">Apply</button>
        </div>
      </div>
    </details>
  );
}
