import { Check } from 'lucide-react';
import { ORDER_PIPELINE, ORDER_STATUS, TERMINAL_STATUSES, type OrderStatus } from '@/types/order';
import type { OrderEvent } from '@/server/dal/orders';

const STAMP = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
});

/**
 * The making of a piece, as a timeline (Phase 7).
 *
 * Two sources are merged: the pipeline (what always happens, so a customer can
 * see what is still to come) and order_status_history (what actually happened,
 * and when — the only place a date can come from). A step with no history row
 * is upcoming; the current step is the order's status.
 *
 * An order that ended early (cancelled, refunded) doesn't get a fake pipeline —
 * it gets the truth: the steps it reached, then the step that ended it.
 */
export default function OrderTimeline({ status, history }: {
  status: OrderStatus;
  history: OrderEvent[];
}) {
  const stamped = new Map<string, OrderEvent>();
  for (const event of history) {
    // The FIRST time a status was reached is when it happened.
    if (!stamped.has(event.to_status)) stamped.set(event.to_status, event);
  }

  const ended = TERMINAL_STATUSES.includes(status);
  const reachedIndex = ORDER_PIPELINE.indexOf(status);

  // For a live order, walk the whole pipeline. For a dead one, only the steps it
  // actually reached, then the ending.
  const steps: OrderStatus[] = ended
    ? [...ORDER_PIPELINE.filter(s => stamped.has(s)), status]
    : [...ORDER_PIPELINE];

  return (
    <div className="lum-timeline" aria-label="Order timeline">
      {steps.map((step, index) => {
        const event = stamped.get(step);
        const isCurrent = step === status;
        const isTerminal = TERMINAL_STATUSES.includes(step);
        const done = !isTerminal && (event !== undefined || (reachedIndex >= 0 && index < reachedIndex));
        const meta = ORDER_STATUS[step];

        const state = isTerminal ? 'dead' : isCurrent ? 'now' : done ? 'done' : 'todo';

        return (
          <div key={step} className={`lum-tl-step is-${state}`}
            // Each step fades in a beat after the one above it, so the timeline
            // draws itself top-down rather than appearing all at once.
            style={{ animationDelay: `${index * 70}ms` }}>
            <div className="lum-tl-marker">
              {done ? <Check size={13} /> : <span className="lum-tl-dot" />}
            </div>
            <div className="lum-tl-body">
              <div className="lum-tl-label">{meta.label}</div>
              <div className="lum-tl-note">{isCurrent || done || isTerminal ? meta.note : ''}</div>
              {event && (
                <div className="lum-tl-stamp">
                  {STAMP.format(new Date(event.created_at))}
                  {event.changed_by ? ' · boutique' : ''}
                  {event.note ? ` · ${event.note}` : ''}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
