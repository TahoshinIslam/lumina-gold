/**
 * Admin gets the same re-mount-per-navigation entrance as the storefront, but
 * without the brand ambience (no dust canvas, no diamond cursor) — it is a
 * tool, not the showroom.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="adm-page-enter">{children}</div>;
}
