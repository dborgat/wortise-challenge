import Link from 'next/link';
import { headers } from 'next/headers';
import { createCaller } from '@/lib/trpc/server';
import { auth } from '@/lib/auth';
import { ArticleCard } from '@/components/articles/article-card';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search-bar';
import { AuthorsList } from '@/components/authors-list';

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

/**
 * Home page
 * Shows all published articles with search and authors list
 */
export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const caller = await createCaller();

  const [articles, authors, session] = await Promise.all([
    q
      ? caller.article.search({ query: q })
      : caller.article.getAll({ limit: 50 }),
    caller.auth.getAuthors(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">CMS</h1>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/articles/new">
                    <Button variant="primary" size="sm">
                      New Article
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to CMS</h2>
          <p className="text-xl text-gray-300 mb-8">
            Discover stories, thinking, and expertise from writers on any topic
          </p>
          <Link href={isLoggedIn ? '/dashboard/articles/new' : '/register'}>
            <Button variant="primary" size="lg">
              Start Writing
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Search */}
        <SearchBar defaultValue={q} />

        {/* Authors */}
        {authors.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Authors</h2>
            <AuthorsList authors={authors} />
          </section>
        )}

        {/* Articles */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {q ? `Results for "${q}"` : 'Latest Articles'}
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {q
                  ? 'No articles found. Try a different search.'
                  : 'No articles yet. Be the first to write!'}
              </p>
              {!q && (
                <Link href={isLoggedIn ? '/dashboard/articles/new' : '/register'}>
                  <Button variant="primary">
                    {isLoggedIn ? 'Create Your First Article' : 'Create an Account'}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} priority={index === 0} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
