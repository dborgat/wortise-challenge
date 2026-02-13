import Link from 'next/link';
import { createCaller } from '@/lib/trpc/server';
import { Button } from '@/components/ui/button';
import { MyArticleList } from '@/components/articles/my-article-list';

/**
 * Dashboard page
 * Shows user's articles
 */
export default async function DashboardPage() {
  const caller = await createCaller();
  const articles = await caller.article.getMyArticles({ limit: 50 });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Articles</h1>
          <p className="text-gray-600 mt-1">
            Manage and edit your published articles
          </p>
        </div>
        <Link href="/dashboard/articles/new">
          <Button variant="primary" size="lg">
            + New Article
          </Button>
        </Link>
      </div>

      <MyArticleList initialArticles={articles} />
    </div>
  );
}
