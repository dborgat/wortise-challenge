import Link from 'next/link';
import { createCaller } from '@/lib/trpc/server';
import { ArticleCard } from '@/components/articles/article-card';
import { Button } from '@/components/ui/button';

/**
 * Home page
 * Shows all published articles
 */
export default async function Home() {
  const caller = await createCaller();
  const articles = await caller.article.getAll({ limit: 50 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">CMS</h1>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
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
          <Link href="/register">
            <Button variant="primary" size="lg">
              Start Writing
            </Button>
          </Link>
        </div>
      </div>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
        
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No articles yet. Be the first to write!</p>
            <Link href="/register">
              <Button variant="primary">Create an Account</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
