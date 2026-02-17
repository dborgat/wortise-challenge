import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createCaller } from "@/lib/trpc/server";
import { Button } from "@/components/ui/button";
import { getTranslations, getLocale } from "next-intl/server";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const caller = await createCaller();

  let article;
  try {
    article = await caller.article.getById({ id });
  } catch (error) {
    notFound();
  }

  if (!article) {
    notFound();
  }

  const [t, locale] = await Promise.all([
    getTranslations("common"),
    getLocale(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link href="/" className="inline-block mb-8">
          <Button variant="ghost" size="sm">
            {t("backToArticles")}
          </Button>
        </Link>

        {/* Article */}
        <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Cover Image */}
          <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-800">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {article.title}
            </h1>

            {/* Author & Date */}
            <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {article.authorName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(article.createdAt).toLocaleDateString(locale, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {article.content}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
