'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { ConfirmButton } from './AdminFeedback';
import { useAdminToast } from './AdminFeedback';

export function AdminFormShell({
  action, children, submitLabel, cancelHref,
}: {
  action: (formData: FormData) => void;
  children: React.ReactNode;
  submitLabel: string;
  cancelHref: string;
}) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useAdminToast();

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty || submitting) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, submitting]);

  return (
    <form id="product-form" className="adm-form" action={action}
      onChange={() => setDirty(true)} onSubmit={() => setSubmitting(true)}
      onInvalid={event => {
        const field = event.target as HTMLElement;
        toast('Please correct the highlighted fields', 'error');
        window.requestAnimationFrame(() => field.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      }}>
      {children}
      <div className="adm-form-actions">
        <button className="adm-btn" type="submit" disabled={submitting}>
          {submitting ? <><LoaderCircle className="adm-spin" size={16} /> Saving…</> : submitLabel}
        </button>
        {dirty ? (
          <ConfirmButton title="Discard unsaved changes?" description="Your edits have not been saved and will be lost."
            confirmLabel="Discard changes" className="adm-btn ghost" onConfirm={() => router.push(cancelHref)}>
            Cancel
          </ConfirmButton>
        ) : (
          <button type="button" className="adm-btn ghost" onClick={() => router.push(cancelHref)}>Cancel</button>
        )}
      </div>
    </form>
  );
}
