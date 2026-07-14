'use client';

import Link from 'next/link';
import { saveTestimonialAction } from '../actions';
import type { Testimonial } from '@/server/dal/testimonials';

/**
 * Add or edit one quote. The same form for both — an id in a hidden field is the
 * only difference, exactly as the article editor does it.
 */
export default function TestimonialForm({ testimonial, error }: {
  testimonial?: Testimonial;
  error?: string;
}) {
  const editing = !!testimonial;

  return (
    <form action={saveTestimonialAction} className="adm-form" style={{ maxWidth: 680 }}>
      {editing && <input type="hidden" name="id" value={testimonial.id} />}

      {error === 'name' && <div className="adm-error">Whose words are these? Add a name.</div>}
      {error === 'quote' && <div className="adm-error">The quote is empty.</div>}
      {error === 'long' && (
        <div className="adm-error">Too long for the card — keep it under 600 characters.</div>
      )}

      <div className="adm-card">
        <div className="adm-grid2">
          <div className="adm-field">
            <label htmlFor="author_name">Name *</label>
            <input id="author_name" name="author_name" required maxLength={120}
              defaultValue={testimonial?.author_name ?? ''}
              placeholder="A. de Villiers" />
            <p className="adm-sub" style={{ marginTop: 6, fontSize: 11.5 }}>
              Printed under the quote. Their initials become the gold monogram on the card.
            </p>
          </div>

          <div className="adm-field">
            <label htmlFor="author_title">City</label>
            <input id="author_title" name="author_title" maxLength={120}
              defaultValue={testimonial?.author_title ?? ''}
              placeholder="Dhaka" />
          </div>
        </div>

        <div className="adm-field">
          <label htmlFor="quote">Their words *</label>
          <textarea id="quote" name="quote" rows={5} required maxLength={600}
            defaultValue={testimonial?.quote ?? ''}
            placeholder="The engagement ring was ready before the promised date, with a certificate for every stone." />
          <p className="adm-sub" style={{ marginTop: 6, fontSize: 11.5 }}>
            Up to 600 characters. The card adds the quotation marks — you do not need to type them.
          </p>
        </div>

        <div className="adm-choice-array adm-choice-array--flags">
          <label className="adm-choice-chip">
            <input type="checkbox" name="is_active"
              defaultChecked={testimonial ? !!testimonial.is_active : true} />
            <span>Show on the home page</span>
          </label>
        </div>
      </div>

      <div className="adm-form-actions">
        <Link className="adm-btn ghost" href="/admin/testimonials">Cancel</Link>
        <button className="adm-btn" type="submit">
          {editing ? 'Save changes' : 'Add testimonial'}
        </button>
      </div>
    </form>
  );
}
