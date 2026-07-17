import Link from 'next/link';
import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Quote } from 'lucide-react';
import { listTestimonials } from '@/server/dal/testimonials';
import {
  deleteTestimonialAction, moveTestimonialAction, toggleTestimonialAction,
} from '../actions';
import { AdminActionButton, ConfirmActionButton } from '@/features/admin/components/AdminFeedback';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';

export const dynamic = 'force-dynamic';

/**
 * Admin → Testimonials: the "In Their Words / Cherished by Collectors" carousel
 * on the landing page.
 *
 * The quotes were a hardcoded array in a component, so the boutique could not add
 * a real client's words, correct a name, or take one down. The order here is the
 * order the carousel plays in.
 */
export default async function AdminTestimonials() {
  const testimonials = await listTestimonials();
  const live = testimonials.filter(t => t.is_active).length;

  return (
    <>
      <div className="adm-detail-head">
        <div>
          <h1 className="adm-h1">Testimonials</h1>
          <p className="adm-sub">
            The quotes under “Cherished by Collectors” on the home page.{' '}
            {live === 0
              ? 'Nothing is showing — with every quote hidden, the section leaves the page entirely.'
              : `${live} showing, in the order below.`}
          </p>
        </div>
        <Link className="adm-btn" href="/admin/testimonials/new">Add a testimonial</Link>
      </div>

      {testimonials.length === 0 ? (
        <AdminEmptyState
          icon={Quote}
          title="No testimonials yet"
          description="Add the first one — it appears in the carousel on the home page."
        />
      ) : (
        <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Order</th>
              <th>Words</th>
              <th style={{ width: 180 }}>Client</th>
              <th style={{ width: 120 }}>On the page</th>
              <th style={{ width: 160 }}></th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map(t => (
              <tr key={t.id} style={t.is_active ? undefined : { opacity: 0.55 }}>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <AdminActionButton action={moveTestimonialAction} values={{ id: t.id, dir: 'up' }}
                      message="Order updated" className="adm-btn ghost sm" ariaLabel="Move up">
                      <ChevronUp size={13} />
                    </AdminActionButton>
                    <AdminActionButton action={moveTestimonialAction} values={{ id: t.id, dir: 'down' }}
                      message="Order updated" className="adm-btn ghost sm" ariaLabel="Move down">
                      <ChevronDown size={13} />
                    </AdminActionButton>
                  </div>
                </td>
                <td>
                  <span style={{ fontStyle: 'italic' }}>
                    “{t.quote.length > 110 ? `${t.quote.slice(0, 110)}…` : t.quote}”
                  </span>
                </td>
                <td>
                  <strong>{t.author_name}</strong>
                  {t.author_title && <div className="adm-sub">{t.author_title}</div>}
                </td>
                <td>
                  <AdminActionButton action={toggleTestimonialAction} values={{ id: t.id }}
                    message="Testimonial updated" className="adm-btn ghost sm">
                    {t.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                    {t.is_active ? 'Showing' : 'Hidden'}
                  </AdminActionButton>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <Link className="adm-btn ghost sm" href={`/admin/testimonials/${t.id}/edit`}>
                      <Pencil size={13} /> Edit
                    </Link>
                    <ConfirmActionButton action={deleteTestimonialAction} values={{ id: t.id }}
                      title={`Remove ${t.author_name}’s testimonial?`}
                      description="Gone for good. Hiding it keeps it off the page without losing the words."
                      confirmLabel="Remove testimonial"
                      className="adm-btn danger sm"
                      successMessage="Testimonial removed">
                      Remove
                    </ConfirmActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </>
  );
}
