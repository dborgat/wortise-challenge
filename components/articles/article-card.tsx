import Link from "next/link";
import Image from "next/image";
import { type Article } from "@/types/article";
import { useLocale } from "next-intl";

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const locale = useLocale();
  const excerpt =
    article.content.slice(0, 150) + (article.content.length > 150 ? "..." : "");

  return (
    <Link
      href={`/dashboard/articles/${article.id}`}
      className="group block bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{excerpt}</p>

        {/* Author & Date */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {article.authorName}
          </span>
          <time dateTime={article.createdAt.toISOString()}>
            {new Date(article.createdAt).toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
      </div>
    </Link>
  );
}
