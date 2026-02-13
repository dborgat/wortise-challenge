import { notFound } from 'next/navigation';
import { createCaller } from '@/lib/trpc/server';
import { ArticleForm } from '@/components/articles/article-form';

/**
 * Edit article page
 * Edit an existing article
 */
export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const caller = await createCaller();
  
  let article;
  try {
    article = await caller.article.getById({ id });
  } catch (error) {
    notFound();
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-gray-600 mt-1">
          Update your article content
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <ArticleForm article={article} />
      </div>
    </div>
  );
}
