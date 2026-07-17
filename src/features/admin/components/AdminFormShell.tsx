'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { ConfirmButton } from './AdminFeedback';
import { useAdminToast } from './AdminFeedback';
import { runInlineValidation, attachLiveValidation } from './formValidation';

export function AdminFormShell({
  action, children, submitLabel, cancelHref,
}: {
  action: (formData: FormData) => void;
  children: React.ReactNode;
  submitLabel: string;
  cancelHref: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
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

  // Clear a field's error the moment it becomes valid again.
  useEffect(() => (formRef.current ? attachLiveValidation(formRef.current) : undefined), []);

  return (
    <form ref={formRef} id="product-form" className="adm-form" action={action} noValidate
      onChange={() => setDirty(true)}
      onSubmit={event => {
        // Inline client-side validation first: flag fields, show messages, and
        // stop the Server Action from firing on a form the browser can already
        // see is incomplete. Only mark submitting once it actually passes.
        if (!runInlineValidation(event.currentTarget)) {
          event.preventDefault();
          toast('Please correct the highlighted fields', 'error');
          return;
        }
        setSubmitting(true);
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
