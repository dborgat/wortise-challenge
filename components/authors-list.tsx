import type { AuthorWithCount } from '@/types/article';

interface AuthorsListProps {
  authors: AuthorWithCount[];
}

export function AuthorsList({ authors }: AuthorsListProps) {
  if (authors.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {authors.map((author) => (
          <div
            key={author.id}
            className="flex-shrink-0 flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
          >
            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
              {author.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{author.name}</p>
              <p className="text-xs text-gray-500">
                {author.articleCount} {author.articleCount === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
