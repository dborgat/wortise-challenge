import Link from "next/link";
import { createCaller } from "@/lib/trpc/server";
import { Button } from "@/components/ui/button";
import { MyArticleList } from "@/components/articles/my-article-list";

interface DashboardPageProps {
  searchParams: Promise<{ page?: string }>;
}

/**
 * Dashboard page
 * Shows user's articles with pagination
 */
export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const caller = await createCaller();
  const result = await caller.article.getMyArticles({ page, limit: 3 });

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

      <MyArticleList
        initialArticles={result.items}
        page={result.page}
        totalPages={result.totalPages}
      />
    </div>
  );
}
