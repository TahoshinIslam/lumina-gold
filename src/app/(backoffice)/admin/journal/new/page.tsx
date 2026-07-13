import ArticleForm from '../ArticleForm';

export const dynamic = 'force-dynamic';

export default async function NewArticle({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <h1 className="adm-h1">Write an article</h1>
      <p className="adm-sub">It appears on the Journal, and in Latest News on the home page.</p>
      <ArticleForm error={error} />
    </>
  );
}
