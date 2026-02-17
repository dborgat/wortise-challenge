import { ArticleForm } from '@/components/articles/article-form';
import { getTranslations } from 'next-intl/server';

export default async function NewArticlePage() {
  const t = await getTranslations('article');

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('createTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('createSubtitle')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <ArticleForm />
      </div>
    </div>
  );
}
