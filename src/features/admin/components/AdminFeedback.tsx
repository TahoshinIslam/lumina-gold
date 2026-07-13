'use client';

import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { AlertTriangle, CheckCircle2, Info, LoaderCircle, TriangleAlert, X, XCircle } from 'lucide-react';

export type ToastTone = 'success' | 'warning' | 'error' | 'info';
type ToastItem = { id: number; message: string; tone: ToastTone };

/**
 * Optional richer return from a server action. Actions that can legitimately
 * no-op (missing id, status unchanged, etc.) return this instead of `void` so
 * callers can show an accurate toast instead of a blanket "success" — actions
 * that still return `void` keep the old always-success behaviour below.
 */
export type ActionResult = { ok: boolean; message?: string };
function isActionResult(value: unknown): value is ActionResult {
  return !!value && typeof value === 'object' && 'ok' in value;
}

const ToastContext = createContext<{
  toast: (message: string, tone?: ToastTone) => void;
} | null>(null);

const ICONS = {
  success: CheckCircle2,
  warning: TriangleAlert,
  error: XCircle,
  info: Info,
};

export function AdminFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const sequence = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);

  const toast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = ++sequence.current;
    setItems(current => [...current.slice(-3), { id, message, tone }]);
    window.setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Suspense fallback={null}><UrlToastListener /></Suspense>
      <div className="adm-toast-viewport" role="region" aria-label="Notifications">
        {items.map(item => {
          const Icon = ICONS[item.tone];
          return (
            <div key={item.id} className={`adm-toast adm-toast--${item.tone}`} role="status">
              <span className="adm-toast-icon"><Icon size={18} /></span>
              <span className="adm-toast-message">{item.message}</span>
              <button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss notification">
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

function UrlToastListener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const feedback = useContext(ToastContext);
  const lastMessage = useRef<string | null>(null);

  useEffect(() => {
    const message = searchParams.get('toast');
    if (!message || !feedback || lastMessage.current === message) return;
    lastMessage.current = message;
    const tone = (searchParams.get('tone') || 'success') as ToastTone;
    feedback.toast(message, ['success', 'warning', 'error', 'info'].includes(tone) ? tone : 'info');
    const next = new URLSearchParams(searchParams.toString());
    next.delete('toast');
    next.delete('tone');
    router.replace(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false });
  }, [feedback, pathname, router, searchParams]);

  return null;
}

export function useAdminToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useAdminToast must be used inside AdminFeedbackProvider');
  return value.toast;
}

export function ConfirmButton({
  title, description, confirmLabel = 'Confirm', children, onConfirm,
  className = 'adm-btn danger', disabled, ariaLabel, ariaPressed,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  children: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** Set when this trigger is really a toggle (e.g. "add gemstone details") rather than a one-shot delete. */
  ariaPressed?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(async () => {
      await onConfirm();
      setOpen(false);
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={pending ? undefined : setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className={className} disabled={disabled} aria-label={ariaLabel} aria-pressed={ariaPressed}>{children}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="adm-confirm-overlay" />
        <Dialog.Content className="adm-confirm">
          <div className="adm-confirm-icon"><AlertTriangle size={23} /></div>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          <div className="adm-confirm-actions">
            <Dialog.Close asChild>
              <button type="button" className="adm-btn ghost" disabled={pending}>Cancel</button>
            </Dialog.Close>
            <button type="button" className="adm-btn danger adm-btn--filled-danger" onClick={confirm} disabled={pending}>
              {pending ? <><LoaderCircle className="adm-spin" size={16} /> Working…</> : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ConfirmActionButton({
  action, values, successMessage, ...props
}: Omit<React.ComponentProps<typeof ConfirmButton>, 'onConfirm'> & {
  action: (formData: FormData) => void | Promise<void> | ActionResult | Promise<ActionResult>;
  values: Record<string, string | number>;
  successMessage?: string;
}) {
  const toast = useAdminToast();
  return (
    <ConfirmButton
      {...props}
      onConfirm={async () => {
        const data = new FormData();
        Object.entries(values).forEach(([key, value]) => data.set(key, String(value)));
        const result = await action(data);
        if (isActionResult(result)) {
          if (result.ok) { if (result.message || successMessage) toast(result.message ?? successMessage!); }
          else toast(result.message ?? 'Nothing to update', 'warning');
        } else if (successMessage) {
          toast(successMessage);
        }
      }}
    />
  );
}

export function AdminActionButton({
  action, values, message, tone = 'success', className, children, ariaLabel,
}: {
  action: (formData: FormData) => void | Promise<void> | ActionResult | Promise<ActionResult>;
  values: Record<string, string | number>;
  message: string;
  tone?: ToastTone;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useAdminToast();
  return (
    <button type="button" className={className} disabled={pending} aria-label={ariaLabel}
      onClick={() => startTransition(async () => {
        const data = new FormData();
        Object.entries(values).forEach(([key, value]) => data.set(key, String(value)));
        const result = await action(data);
        if (isActionResult(result)) toast(result.message ?? message, result.ok ? tone : 'warning');
        else toast(message, tone);
      })}>
      {pending ? <LoaderCircle className="adm-spin" size={15} /> : children}
    </button>
  );
}

/**
 * Same-page form (e.g. "add a size", a row's status <select>) that submits
 * via the server action directly instead of navigating — building `FormData`
 * from the real form element (not a fixed `values` object like
 * `AdminActionButton`) so it carries whatever fields the caller renders as
 * children, including ones the user just changed (a <select>'s current
 * value, etc). Prevents the page-jerk a `redirect()`-based toast would cause
 * on pages like Sizes that stack multiple sections above the fold.
 */
export function AdminInlineForm({
  action, successMessage, resetOnSuccess = false, className, style, children,
}: {
  action: (formData: FormData) => void | Promise<void> | ActionResult | Promise<ActionResult>;
  successMessage: string;
  resetOnSuccess?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useAdminToast();
  return (
    <form className={className} style={style} onSubmit={event => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      startTransition(async () => {
        const result = await action(data);
        if (isActionResult(result)) {
          toast(result.message ?? successMessage, result.ok ? 'success' : 'warning');
          if (result.ok && resetOnSuccess) form.reset();
        } else {
          toast(successMessage);
          if (resetOnSuccess) form.reset();
        }
      });
    }}>
      <fieldset disabled={pending} style={{ border: 0, margin: 0, padding: 0, display: 'contents' }}>
        {children}
      </fieldset>
    </form>
  );
}
