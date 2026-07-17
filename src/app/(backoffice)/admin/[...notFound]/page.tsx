import { notFound } from 'next/navigation';

/**
 * Catch-all under /admin so an unmatched back-office URL renders the ADMIN
 * not-found (light gold, inside the admin shell) rather than the storefront's
 * dark root 404.
 *
 * Next only reaches for a segment-level not-found.tsx when notFound() is thrown
 * from a matched route — a genuinely unmatched path falls through to the ROOT
 * not-found. This lowest-priority catch-all is what turns "no such /admin page"
 * into exactly that thrown notFound(). Real admin routes match first; only
 * leftovers land here.
 */
export default function AdminCatchAll() {
  notFound();
}
