import { ArticleForm } from '@/components/articles/article-form';

/**
 * New article page
 * Create a new article
 */
export default function NewArticlePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
        <p className="text-gray-600 mt-1">
          Share your thoughts with the world
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <ArticleForm />
      </div>
    </div>
  );
}
