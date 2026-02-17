import { notFound } from 'next/navigation';
import { createCaller } from '@/lib/trpc/server';
import { ArticleForm } from '@/components/articles/article-form';
import { getTranslations } from 'next-intl/server';

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

  const t = await getTranslations('article');

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('editTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('editSubtitle')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <ArticleForm article={article} />
      </div>
    </div>
  );
}
