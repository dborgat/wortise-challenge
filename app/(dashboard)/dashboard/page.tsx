import Link from "next/link";
import { createCaller } from "@/lib/trpc/server";
import { Button } from "@/components/ui/button";
import { MyArticleList } from "@/components/articles/my-article-list";
import { getTranslations } from "next-intl/server";

interface DashboardPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const caller = await createCaller();
  const result = await caller.article.getMyArticles({ page, limit: 3 });

  const [t, tArticle] = await Promise.all([
    getTranslations("common"),
    getTranslations("article"),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("myArticles")}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {tArticle("manageSubtitle")}
          </p>
        </div>
        <Link href="/dashboard/articles/new">
          <Button variant="primary" size="lg">
            + {t("newArticle")}
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
