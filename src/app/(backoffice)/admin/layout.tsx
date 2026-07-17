import { cookies } from 'next/headers';
import './admin.css';
import { ADMIN_COOKIE } from '@/server/auth/admin';
import { verifySession } from '@/server/auth/adminSession';
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

/** The signed-in admin, for the topbar. Resolved from the session cookie now
 *  that logins are per-account, so it names whoever is actually logged in
 *  rather than just the first row in the table. Display only — the gate is the
 *  authed check below and the proxy. */
async function currentAdmin(adminId: number | null) {
  if (!adminId) return { name: 'Administrator', role: 'Admin' };
  try {
    const [row] = await query<{ name: string; role: string | null }>(
      `SELECT au.name, r.name role FROM admin_users au
         LEFT JOIN roles r ON r.id = au.role_id
        WHERE au.id = ? AND au.is_active = 1 LIMIT 1`,
      [adminId]);
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
  const adminId = verifySession(jar.get(ADMIN_COOKIE)?.value);

  // Login page (or any unauthenticated hit the middleware redirects) — no chrome.
  if (adminId === null) return <>{children}</>;

  // Read the collapsed state on the server so the sidebar renders at its final
  // width on first paint instead of snapping open and then shut.
  const defaultOpen = jar.get('sidebar_state')?.value !== 'false';
  const admin = await currentAdmin(adminId);

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
