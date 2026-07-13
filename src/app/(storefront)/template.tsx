import PageShell from '@/components/layout/PageShell';

/**
 * Re-mounted by React on every navigation into this route group — that is what
 * replays the page-entrance animation. See PageShell.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
