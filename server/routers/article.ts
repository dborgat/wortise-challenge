import { z } from "zod";
import { ObjectId } from "mongodb";
import { router, publicProcedure, protectedProcedure } from "@/lib/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  getArticlesCollection,
  getUsersCollection,
} from "@/server/db/collections";
import type { ArticleDocument } from "@/server/db/collections";
import { getTranslations } from "next-intl/server";
import {
  createArticleSchema,
  updateArticleSchema,
} from "@/lib/validations/article";
import { objectIdSchema } from "@/lib/validations/shared";
import type {
  Article,
  MyArticle,
  PaginatedArticles,
  PaginatedMyArticles,
} from "@/types/article";

const EXCERPT_MAX_LENGTH = 150;

/**
 * Truncate content into an excerpt
 */
function truncate(text: string, max = EXCERPT_MAX_LENGTH): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

/**
 * Map a MongoDB article document + author info to an Article
 */
function mapDocToArticle(
  doc: ArticleDocument,
  author: { name: string; email: string } | undefined,
  options?: { excerptOnly?: boolean }
): Article {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    content: options?.excerptOnly ? truncate(doc.content) : doc.content,
    coverImage: doc.coverImage,
    authorId: doc.authorId.toHexString(),
    authorName: author?.name ?? "Unknown",
    authorEmail: author?.email ?? "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/**
 * Map a MongoDB article document to a MyArticle (no author info)
 */
function mapDocToMyArticle(
  doc: ArticleDocument,
  options?: { excerptOnly?: boolean }
): MyArticle {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    content: options?.excerptOnly ? truncate(doc.content) : doc.content,
    coverImage: doc.coverImage,
    authorId: doc.authorId.toHexString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/**
 * Resolve author map from a list of author ObjectIds
 */
async function resolveAuthors(authorIds: string[]) {
  const users = await getUsersCollection();
  const uniqueIds = [...new Set(authorIds)];
  const authorDocs = await users
    .find(
      { _id: { $in: uniqueIds.map((id) => new ObjectId(id)) } },
      { projection: { name: 1, email: 1 } }
    )
    .toArray();
  return new Map(authorDocs.map((a) => [a._id.toHexString(), a]));
}

/**
 * Article router
 * Handles all article-related operations
 */
export const articleRouter = router({
  /**
   * Get all articles (public)
   */
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(100).optional().default(6),
      })
    )
    .query(async ({ input }): Promise<PaginatedArticles> => {
      const articles = await getArticlesCollection();

      const [docs, total] = await Promise.all([
        articles
          .find({})
          .sort({ createdAt: -1 })
          .skip((input.page - 1) * input.limit)
          .limit(input.limit)
          .toArray(),
        articles.countDocuments(),
      ]);

      const authorMap = await resolveAuthors(
        docs.map((d) => d.authorId.toHexString())
      );

      return {
        items: docs.map((doc) => {
          const author = authorMap.get(doc.authorId.toHexString());
          return mapDocToArticle(doc, author, { excerptOnly: true });
        }),
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  /**
   * Get article by ID (public)
   */
  getById: publicProcedure
    .input(
      z.object({
        id: objectIdSchema,
      })
    )
    .query(async ({ input }): Promise<Article | null> => {
      const articles = await getArticlesCollection();
      const doc = await articles.findOne({ _id: new ObjectId(input.id) });
      if (!doc) return null;

      const users = await getUsersCollection();
      const author = await users.findOne(
        { _id: doc.authorId },
        { projection: { name: 1, email: 1 } }
      );

      return mapDocToArticle(doc, author ?? undefined);
    }),

  /**
   * Create article (protected)
   */
  create: protectedProcedure
    .input(createArticleSchema)
    .mutation(async ({ input, ctx }) => {
      const articles = await getArticlesCollection();
      const now = new Date();

      const result = await articles.insertOne({
        _id: new ObjectId(),
        title: input.title,
        content: input.content,
        coverImage: input.coverImage,
        authorId: new ObjectId(ctx.user.id),
        createdAt: now,
        updatedAt: now,
      });

      return { id: result.insertedId.toHexString(), ...input };
    }),

  /**
   * Update article (protected - must be the author)
   */
  update: protectedProcedure
    .input(updateArticleSchema.extend({ id: objectIdSchema }))
    .mutation(async ({ input, ctx }) => {
      const t = await getTranslations("errors");

      const articles = await getArticlesCollection();
      const doc = await articles.findOne(
        { _id: new ObjectId(input.id) },
        { projection: { authorId: 1 } }
      );

      if (!doc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: t("articleNotFound"),
        });
      }

      if (doc.authorId.toHexString() !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: t("onlyEditOwn") });
      }

      const { id, ...updates } = input;
      await articles.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } }
      );

      return { id };
    }),

  /**
   * Delete article (protected - must be the author)
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: objectIdSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const t = await getTranslations("errors");

      const articles = await getArticlesCollection();
      const doc = await articles.findOne(
        { _id: new ObjectId(input.id) },
        { projection: { authorId: 1 } }
      );

      if (!doc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: t("articleNotFound"),
        });
      }

      if (doc.authorId.toHexString() !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: t("onlyDeleteOwn") });
      }

      await articles.deleteOne({ _id: new ObjectId(input.id) });
      return { success: true };
    }),

  /**
   * Search articles by title, content, or author name (public)
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        limit: z.number().int().min(1).max(100).optional().default(50),
      })
    )
    .query(async ({ input }): Promise<Article[]> => {
      const articles = await getArticlesCollection();
      const users = await getUsersCollection();

      // Phase 1: Find authors matching the query by name
      const escapedQuery = input.query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matchingAuthors = await users
        .find(
          { name: { $regex: escapedQuery, $options: "i" } },
          { projection: { _id: 1 } }
        )
        .toArray();
      const matchingAuthorIds = matchingAuthors.map((a) => a._id);

      // Phase 2: TWO SEPARATE QUERIES to avoid $text + $or conflict
      let textSearchDocs: ArticleDocument[] = [];
      let authorSearchDocs: ArticleDocument[] = [];

      // Query 1: Text search on title+content
      try {
        textSearchDocs = await articles
          .find({ $text: { $search: input.query } })
          .sort({ createdAt: -1 })
          .limit(input.limit)
          .toArray();
      } catch (error) {
        // If text index doesn't exist, fall back to regex
        textSearchDocs = await articles
          .find({
            $or: [
              { title: { $regex: escapedQuery, $options: "i" } },
              { content: { $regex: escapedQuery, $options: "i" } },
            ],
          })
          .sort({ createdAt: -1 })
          .limit(input.limit)
          .toArray();
      }

      // Query 2: Articles by matching authors
      if (matchingAuthorIds.length > 0) {
        authorSearchDocs = await articles
          .find({ authorId: { $in: matchingAuthorIds } })
          .sort({ createdAt: -1 })
          .limit(input.limit)
          .toArray();
      }

      // Phase 3: Merge and deduplicate results
      const docsMap = new Map<string, ArticleDocument>();
      [...textSearchDocs, ...authorSearchDocs].forEach((doc) => {
        docsMap.set(doc._id.toHexString(), doc);
      });
      const docs = Array.from(docsMap.values())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, input.limit);

      // Phase 4: Resolve author names
      const authorMap = await resolveAuthors(
        docs.map((d) => d.authorId.toHexString())
      );

      return docs.map((doc) => {
        const author = authorMap.get(doc.authorId.toHexString());
        return mapDocToArticle(doc, author, { excerptOnly: true });
      });
    }),

  /**
   * Get articles by current user (protected)
   */
  getMyArticles: protectedProcedure
    .input(
      z.object({
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(100).optional().default(10),
      })
    )
    .query(async ({ input, ctx }): Promise<PaginatedMyArticles> => {
      const articles = await getArticlesCollection();
      const filter = { authorId: new ObjectId(ctx.user.id) };

      const [docs, total] = await Promise.all([
        articles
          .find(filter)
          .sort({ createdAt: -1 })
          .skip((input.page - 1) * input.limit)
          .limit(input.limit)
          .toArray(),
        articles.countDocuments(filter),
      ]);

      return {
        items: docs.map((doc) => mapDocToMyArticle(doc, { excerptOnly: true })),
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),
});
