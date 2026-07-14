import TestimonialForm from '../TestimonialForm';

export const dynamic = 'force-dynamic';

export default async function NewTestimonial({ searchParams }: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <h1 className="adm-h1">Add a testimonial</h1>
      <p className="adm-sub">
        A client’s own words, for the carousel on the home page.
      </p>
      <div style={{ marginTop: 20 }}>
        <TestimonialForm error={error} />
      </div>
    </>
  );
}
