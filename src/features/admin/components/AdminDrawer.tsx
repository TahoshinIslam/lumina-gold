'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import {
  Sheet, SheetContent, SheetTitle, SheetDescription,
} from '@/components/animate-ui/components/radix/sheet';
import { useSidebar } from '@/components/animate-ui/components/radix/sidebar';
import { useAdminToast } from '@/features/admin/components/AdminFeedback';

/**
 * Right-side drawer for admin create/edit forms, driven by an intercepting
 * route (see app/(backoffice)/admin/@modal). Field markup goes in `children`;
 * this component owns the <form> tag so the footer's buttons can sit outside
 * the scrollable body while still submitting it (via `form={formId}`).
 *
 * @param routePath the drawer's OWN route, e.g. "/admin/products/new". It is
 *   what opens and closes the sheet, and it has to be passed in rather than
 *   read from usePathname(): a parallel slot keeps its last active subpage
 *   across soft navigations "even if they don't match the current URL"
 *   (Next.js parallel-routes docs), so once the server action redirects to the
 *   list, @modal goes right on rendering this drawer — before this, only a hard
 *   refresh (which falls back to default.tsx) could clear it. Comparing the
 *   live pathname against this fixed route is what actually closes it. Reading
 *   the pathname at mount instead would race the transition, since the slot
 *   renders before the address bar commits.
 */
export function AdminDrawer({
  title, description, routePath, formId, action, submitLabel, children,
}: {
  title: string;
  description?: string;
  routePath: string;
  formId: string;
  action: (formData: FormData) => void;
  submitLabel: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, state: sidebarState } = useSidebar();
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const toast = useAdminToast();

  // Only the pathname is compared, so the ?error=missing bounce — which
  // re-renders this same route with a message — leaves the drawer open.
  const open = pathname === routePath;

  // The slot keeps this component mounted after the drawer closes, so its state
  // would otherwise leak into the next open (a stale `dirty` would pop the
  // discard prompt on a form nobody touched). Reset on the closing render —
  // Radix only fires onOpenChange for user dismissals, so a URL-driven close
  // gives us no callback to hang this off.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) { setDirty(false); setSubmitting(false); setConfirmClose(false); }
  }

  const close = () => {
    if (dirty && !submitting) setConfirmClose(true);
    else router.back();
  };

  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) close(); }}>
      {/* Plain divs (not SheetHeader/SheetFooter) for head & foot: those
          primitives inject Tailwind `flex flex-col`, which overrides the
          footer's row layout and stacks the buttons vertically. SheetTitle /
          SheetDescription are kept — Radix Dialog requires a labelled title. */}
      <SheetContent
        className="adm-drawer"
        data-sidebar-state={sidebarState}
        data-mobile={isMobile ? 'true' : 'false'}
        side="right"
      >
        <div className="adm-drawer-head">
          <SheetTitle className="adm-drawer-title">{title}</SheetTitle>
          {description && <SheetDescription className="adm-drawer-desc">{description}</SheetDescription>}
        </div>

        <form id={formId} action={action} className="adm-drawer-body"
          onChange={() => setDirty(true)}
          onSubmit={() => setSubmitting(true)}
          onInvalid={event => {
            const field = event.target as HTMLElement;
            toast('Please correct the highlighted fields', 'error');
            window.requestAnimationFrame(() => field.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          }}>
          {children}
        </form>

        <div className="adm-drawer-foot">
          <button type="button" className="adm-btn ghost" onClick={close} disabled={submitting}>Cancel</button>
          <button type="submit" form={formId} className="adm-btn" disabled={submitting}>
            {submitting ? <><LoaderCircle className="adm-spin" size={16} /> Saving…</> : submitLabel}
          </button>
        </div>
      </SheetContent>

      <Dialog.Root open={confirmClose} onOpenChange={setConfirmClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="adm-confirm-overlay" />
          <Dialog.Content className="adm-confirm">
            <div className="adm-confirm-icon"><AlertTriangle size={23} /></div>
            <Dialog.Title>Discard unsaved changes?</Dialog.Title>
            <Dialog.Description>Your edits have not been saved and will be lost.</Dialog.Description>
            <div className="adm-confirm-actions">
              <Dialog.Close asChild><button type="button" className="adm-btn ghost">Keep editing</button></Dialog.Close>
              <button type="button" className="adm-btn danger adm-btn--filled-danger" onClick={() => router.back()}>
                Discard changes
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Sheet>
  );
}
