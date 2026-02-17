import Link from 'next/link';
import { headers } from 'next/headers';
import { createCaller } from '@/lib/trpc/server';
import { auth } from '@/lib/auth';
import { ArticleCard } from '@/components/articles/article-card';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search-bar';
import { AuthorsList } from '@/components/authors-list';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { getTranslations } from 'next-intl/server';
import type { Article } from '@/types/article';

interface HomeProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const q = params.q;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const caller = await createCaller();

  const [articlesResult, authors, session, t, tHome] = await Promise.all([
    q
      ? caller.article.search({ query: q })
      : caller.article.getAll({ page, limit: 6 }),
    caller.auth.getAuthors(),
    auth.api.getSession({ headers: await headers() }),
    getTranslations('common'),
    getTranslations('home'),
  ]);

  const isSearch = !!q;
  const articles = isSearch ? (articlesResult as Article[]) : (articlesResult as { items: Article[]; page: number; totalPages: number }).items;
  const totalPages = isSearch ? 1 : (articlesResult as { totalPages: number }).totalPages;

  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('cms')}</h1>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      {t('dashboard')}
                    </Button>
                  </Link>
                  <Link href="/dashboard/articles/new">
                    <Button variant="primary" size="sm">
                      {t('newArticle')}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      {t('signIn')}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">
                      {t('signUp')}
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
          <h2 className="text-4xl font-bold mb-4">{tHome('welcome')}</h2>
          <p className="text-xl text-gray-300 mb-8">
            {tHome('subtitle')}
          </p>
          <Link href={isLoggedIn ? '/dashboard/articles/new' : '/register'}>
            <Button variant="primary" size="lg">
              {t('startWriting')}
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{tHome('authors')}</h2>
            <AuthorsList authors={authors} />
          </section>
        )}

        {/* Articles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {q ? tHome('resultsFor', { query: q }) : tHome('latestArticles')}
            </h2>
            {q && (
              <Link href="/">
                <Button variant="secondary" size="sm">
                  {t('viewAll')}
                </Button>
              </Link>
            )}
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {q ? tHome('noResults') : tHome('noArticles')}
              </p>
              {!q && (
                <Link href={isLoggedIn ? '/dashboard/articles/new' : '/register'}>
                  <Button variant="primary">
                    {isLoggedIn ? tHome('createFirstArticle') : tHome('createAccount')}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} priority={index === 0} />
                ))}
              </div>

              {/* Pagination */}
              {!isSearch && totalPages > 1 && (
                <div className="flex items-center justify-between pt-8">
                  {page > 1 ? (
                    <Link href={`/?page=${page - 1}`}>
                      <Button variant="secondary" size="sm">
                        {t('previous')}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="secondary" size="sm" disabled>
                      {t('previous')}
                    </Button>
                  )}

                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('page', { current: page, total: totalPages })}
                  </span>

                  {page < totalPages ? (
                    <Link href={`/?page=${page + 1}`}>
                      <Button variant="secondary" size="sm">
                        {t('next')}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="secondary" size="sm" disabled>
                      {t('next')}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
