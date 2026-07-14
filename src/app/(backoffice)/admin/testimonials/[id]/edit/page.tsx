import { notFound } from 'next/navigation';
import { getTestimonial } from '@/server/dal/testimonials';
import TestimonialForm from '../../TestimonialForm';

export const dynamic = 'force-dynamic';

export default async function EditTestimonial({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const testimonial = await getTestimonial(Number(id));
  if (!testimonial) notFound();

  return (
    <>
      <h1 className="adm-h1">Edit testimonial</h1>
      <p className="adm-sub">{testimonial.author_name}’s words, as shown on the home page.</p>
      <div style={{ marginTop: 20 }}>
        <TestimonialForm testimonial={testimonial} error={error} />
      </div>
    </>
  );
}
