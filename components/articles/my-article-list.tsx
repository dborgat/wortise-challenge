"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { type MyArticle } from "@/types/article";
import { useTranslations, useLocale } from "next-intl";

interface MyArticleListProps {
  initialArticles: MyArticle[];
  page: number;
  totalPages: number;
}

export function MyArticleList({ initialArticles, page, totalPages }: MyArticleListProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const t = useTranslations("common");
  const tArticle = useTranslations("article");
  const locale = useLocale();

  const deleteMutation = trpc.article.delete.useMutation({
    onSuccess: () => {
      utils.article.getMyArticles.invalidate();
      router.refresh();
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(tArticle("deleteConfirm", { title }))) {
      return;
    }

    await deleteMutation.mutateAsync({ id });
  };

  if (initialArticles.length === 0 && page === 1) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {tArticle("noArticles")}
        </p>
        <Link href="/dashboard/articles/new">
          <Button variant="primary">{tArticle("createFirst")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialArticles.map((article) => (
        <div
          key={article.id}
          className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-5 flex gap-4">
            {/* Thumbnail */}
            <div className="relative w-32 h-24 shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 truncate">
                {article.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                {article.content.slice(0, 120)}...
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {tArticle("created", {
                  date: new Date(article.createdAt).toLocaleDateString(locale),
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <Link href={`/dashboard/articles/${article.id}`}>
                <Button variant="ghost" size="sm" className="w-full">
                  {t("view")}
                </Button>
              </Link>
              <Link href={`/dashboard/articles/edit/${article.id}`}>
                <Button variant="secondary" size="sm" className="w-full">
                  {t("edit")}
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(article.id, article.title)}
                isLoading={deleteMutation.isPending}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {page > 1 ? (
            <Link href={`/dashboard?page=${page - 1}`}>
              <Button variant="secondary" size="sm">
                {t("previous")}
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              {t("previous")}
            </Button>
          )}

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("page", { current: page, total: totalPages })}
          </span>

          {page < totalPages ? (
            <Link href={`/dashboard?page=${page + 1}`}>
              <Button variant="secondary" size="sm">
                {t("next")}
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              {t("next")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
