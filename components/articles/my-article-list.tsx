"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { type MyArticle } from "@/types/article";

interface MyArticleListProps {
  initialArticles: MyArticle[];
  page: number;
  totalPages: number;
}

/**
 * My articles list component
 * Displays user's own articles with edit/delete actions and pagination
 */
export function MyArticleList({ initialArticles, page, totalPages }: MyArticleListProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.article.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      utils.article.getMyArticles.invalidate();
      router.refresh();
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    await deleteMutation.mutateAsync({ id });
  };

  if (initialArticles.length === 0 && page === 1) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          You haven&apos;t created any articles yet.
        </p>
        <Link href="/dashboard/articles/new">
          <Button variant="primary">Create Your First Article</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialArticles.map((article) => (
        <div
          key={article.id}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-5 flex gap-4">
            {/* Thumbnail */}
            <div className="relative w-32 h-24 shrink-0 rounded-md overflow-hidden bg-gray-100">
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
              <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {article.content.slice(0, 120)}...
              </p>
              <div className="text-xs text-gray-500">
                Created {new Date(article.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <Link href={`/dashboard/articles/${article.id}`}>
                <Button variant="ghost" size="sm" className="w-full">
                  View
                </Button>
              </Link>
              <Link href={`/dashboard/articles/edit/${article.id}`}>
                <Button variant="secondary" size="sm" className="w-full">
                  Edit
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(article.id, article.title)}
                isLoading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {page > 1 ? (
            <Link href={`/dashboard?page=${page - 1}`}>
              <Button variant="secondary" size="sm">
                Previous
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              Previous
            </Button>
          )}

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link href={`/dashboard?page=${page + 1}`}>
              <Button variant="secondary" size="sm">
                Next
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
