import { notFound } from 'next/navigation';
import { getArticleForAdmin } from '@/server/dal/journal';
import ArticleForm from '../../ArticleForm';

export const dynamic = 'force-dynamic';

export default async function EditArticle({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const article = await getArticleForAdmin(Number(id));
  if (!article) notFound();

  return (
    <>
      <h1 className="adm-h1">Edit article</h1>
      <p className="adm-sub">/journal/{article.slug}</p>
      <ArticleForm article={article} error={error} />
    </>
  );
}
