export type LinkParams = Record<string, string | string[] | undefined>;

/** Builds a query string that preserves multi-value params (e.g. repeated `status=`). */
export function buildQuery(params: LinkParams): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach(v => v && qs.append(key, v));
    } else if (value !== '') {
      qs.set(key, value);
    }
  }
  return qs.toString();
}
