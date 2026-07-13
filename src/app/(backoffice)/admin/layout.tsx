import { cookies } from 'next/headers';
import './admin.css';
import { ADMIN_COOKIE, adminToken } from '@/server/auth/admin';
import { query } from '@/server/db/client';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/animate-ui/components/radix/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AdminFeedbackProvider } from '@/features/admin/components/AdminFeedback';

export const metadata = { title: 'Admin — Nahar Jewellers' };

/** Auth is still a single shared password, so this is only for display. */
async function currentAdmin() {
  try {
    const [row] = await query<{ name: string; role: string | null }>(
      `SELECT au.name, r.name role FROM admin_users au
         LEFT JOIN roles r ON r.id = au.role_id
        WHERE au.is_active = 1 ORDER BY au.id LIMIT 1`);
    return { name: row?.name ?? 'Administrator', role: row?.role ?? 'Admin' };
  } catch {
    return { name: 'Administrator', role: 'Admin' };
  }
}

export default async function AdminLayout({
  children, modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const jar = await cookies();
  const authed = jar.get(ADMIN_COOKIE)?.value === adminToken();

  // Login page (or any unauthenticated hit the middleware redirects) — no chrome.
  if (!authed) return <>{children}</>;

  // Read the collapsed state on the server so the sidebar renders at its final
  // width on first paint instead of snapping open and then shut.
  const defaultOpen = jar.get('sidebar_state')?.value !== 'false';
  const admin = await currentAdmin();

  return (
    <AdminFeedbackProvider>
      <SidebarProvider className="adm-shell" defaultOpen={defaultOpen}>
        <AdminSidebar />
        <SidebarInset className="adm-inset">
          <header className="adm-topbar">
            <SidebarTrigger />
            <AdminTopbar name={admin.name} role={admin.role} />
          </header>
          <main className="adm-main">{children}</main>
        </SidebarInset>
        {modal}
      </SidebarProvider>
    </AdminFeedbackProvider>
  );
}
