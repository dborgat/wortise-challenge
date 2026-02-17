import { memo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { AuthorWithCount } from '@/types/article';

interface AuthorsListProps {
  authors: AuthorWithCount[];
}

export const AuthorsList = memo(function AuthorsList({ authors }: AuthorsListProps) {
  const t = useTranslations('home');

  if (authors.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/?q=${encodeURIComponent(author.name)}`}
            className="flex-shrink-0 flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center text-sm font-semibold">
              {author.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{author.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('articleCount', { count: author.articleCount })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
