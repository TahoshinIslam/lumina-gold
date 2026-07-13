import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

/** Centered placeholder for an empty list page, with an icon and an optional call-to-action. */
export function AdminEmptyState({
  icon: Icon, title, description, actionHref, actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="adm-empty">
      <div className="adm-empty-icon"><Icon size={26} /></div>
      <p className="adm-empty-title">{title}</p>
      {description && <p className="adm-empty-desc">{description}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="adm-btn sm" style={{ marginTop: 14 }}>{actionLabel}</Link>
      )}
    </div>
  );
}
