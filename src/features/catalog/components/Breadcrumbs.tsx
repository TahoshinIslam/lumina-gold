import { Fragment } from 'react';
import Link from 'next/link';
import type { Crumb } from '@/features/catalog/breadcrumbs';

/**
 * The one breadcrumb trail — product pages and every listing landing page.
 * Fragments, not wrapper elements: `.lum-crumbs span` is the current-page
 * colour, so only the final crumb may be a <span>.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="lum-crumbs" aria-label="Breadcrumb">
      {items.map((crumb, index) => (
        <Fragment key={`${crumb.label}-${index}`}>
          {index > 0 && ' / '}
          {crumb.href
            ? <Link href={crumb.href}>{crumb.label}</Link>
            : <span aria-current="page">{crumb.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}
