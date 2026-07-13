'use client';

import { useEffect, useState, useTransition } from 'react';
import { ConfirmButton, useAdminToast } from './AdminFeedback';

type BulkAction = {
  label: string;
  formAction: (formData: FormData) => void | Promise<void>;
  danger?: boolean;
  confirm?: string;
};

/**
 * Floating selection summary + action buttons for a checkbox-driven bulk form.
 * Reads/writes the checkboxes by DOM id rather than owning the row data, so the
 * table itself stays a plain server-rendered `<table>` — this only needs to
 * exist once per page, wired to `formId`/`selectAllId`.
 */
export function BulkActionsBar({
  formId, selectAllId, label = 'item', actions, children,
}: {
  formId: string;
  selectAllId: string;
  label?: string;
  actions: BulkAction[];
  /** Extra form controls (e.g. a status <select>) tied to the same form via `form={formId}`. */
  children?: React.ReactNode;
}) {
  const [count, setCount] = useState(0);
  const [pending, startTransition] = useTransition();
  const toast = useAdminToast();

  const run = (action: BulkAction) => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return Promise.resolve();
    return Promise.resolve(action.formAction(new FormData(form))).then(() => {
      toast(`${action.label} completed successfully`);
    });
  };

  useEffect(() => {
    const selectAll = document.getElementById(selectAllId) as HTMLInputElement | null;

    // Row checkboxes associate with the form via the `form="…"` attribute rather
    // than DOM nesting (the table can't be a descendant of the form — see the
    // per-row delete forms it also contains), so a listener on the <form>
    // element itself would never see their change events; bubbling follows the
    // DOM tree, not form association. Delegate on `document` instead.
    const selector = `input[type=checkbox][name="ids"][form="${formId}"]`;
    const boxes = () => Array.from(document.querySelectorAll<HTMLInputElement>(selector));

    const update = () => {
      const all = boxes();
      const checked = all.filter(b => b.checked).length;
      setCount(checked);
      if (selectAll) {
        selectAll.checked = checked > 0 && checked === all.length;
        selectAll.indeterminate = checked > 0 && checked < all.length;
      }
    };

    const onChange = (e: Event) => {
      if ((e.target as HTMLElement)?.matches?.(selector)) update();
    };
    const onSelectAll = () => {
      boxes().forEach(b => { b.checked = selectAll!.checked; });
      update();
    };

    // A bulk action resubmits the form and Next.js patches the table via a
    // Server Action revalidation, not a full navigation — React replaces the
    // row elements (fresh, unchecked) but this component's own `count` state
    // survives the patch, so it'd otherwise keep reporting stale checked rows.
    // A MutationObserver catches that DOM swap and re-syncs. It has to watch
    // document.body (the table isn't behind one stable container across every
    // page this component is used on), but toasts/dialogs mount and unmount
    // via the same body far more often than the table patches — filter inside
    // the callback so only mutations that actually touch a row checkbox
    // trigger a re-count, instead of re-scanning the whole document on every
    // unrelated DOM change.
    const touchesCheckbox = (node: Node) =>
      node instanceof Element && (node.matches(selector) || !!node.querySelector(selector));
    const observer = new MutationObserver(mutations => {
      const relevant = mutations.some(m =>
        Array.from(m.addedNodes).some(touchesCheckbox) || Array.from(m.removedNodes).some(touchesCheckbox),
      );
      if (relevant) update();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('change', onChange);
    selectAll?.addEventListener('change', onSelectAll);
    update();
    return () => {
      document.removeEventListener('change', onChange);
      selectAll?.removeEventListener('change', onSelectAll);
      observer.disconnect();
    };
  }, [formId, selectAllId]);

  if (count === 0) return null;

  return (
    <div className="adm-bulkbar">
      <span className="adm-bulkbar-count">{count} {label}{count === 1 ? '' : 's'} selected</span>
      <div className="adm-bulkbar-actions">
        {children}
        {actions.map(a => a.confirm ? (
          <ConfirmButton
            key={a.label}
            title={`${a.label} selected ${label}${count === 1 ? '' : 's'}?`}
            description={a.confirm}
            confirmLabel={a.label}
            className={`adm-btn sm ${a.danger ? 'danger' : 'ghost'}`}
            onConfirm={() => run(a)}
          >{a.label}</ConfirmButton>
        ) : (
          <button key={a.label} type="button" disabled={pending}
            className={`adm-btn sm ${a.danger ? 'danger' : 'ghost'}`}
            onClick={() => startTransition(() => { void run(a); })}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
