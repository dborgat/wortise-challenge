import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { router, publicProcedure, protectedProcedure } from '@/lib/trpc/init';
import { TRPCError } from '@trpc/server';
import { getArticlesCollection, getUsersCollection } from '@/server/db/collections';
import type { Article, MyArticle, PaginatedArticles, PaginatedMyArticles } from '@/types/article';

/**
 * Article router
 * Handles all article-related operations
 */
export const articleRouter = router({
  /**
   * Get all articles (public)
   */
  getAll: publicProcedure
    .input(z.object({
      page: z.number().min(1).optional().default(1),
      limit: z.number().min(1).max(100).optional().default(6),
    }))
    .query(async ({ input }): Promise<PaginatedArticles> => {
      const articles = await getArticlesCollection();
      const users = await getUsersCollection();

      const [docs, total] = await Promise.all([
        articles
          .find()
          .sort({ createdAt: -1 })
          .skip((input.page - 1) * input.limit)
          .limit(input.limit)
          .toArray(),
        articles.countDocuments(),
      ]);

      const authorIds = [...new Set(docs.map((d) => d.authorId.toHexString()))];
      const authorDocs = await users
        .find({ _id: { $in: authorIds.map((id) => new ObjectId(id)) } })
        .toArray();
      const authorMap = new Map(authorDocs.map((a) => [a._id.toHexString(), a]));

      return {
        items: docs.map((doc) => {
          const author = authorMap.get(doc.authorId.toHexString());
          return {
            id: doc._id.toHexString(),
            title: doc.title,
            content: doc.content,
            coverImage: doc.coverImage,
            authorId: doc.authorId.toHexString(),
            authorName: author?.name ?? 'Unknown',
            authorEmail: author?.email ?? '',
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          };
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
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }): Promise<Article | null> => {
      if (!ObjectId.isValid(input.id)) return null;

      const articles = await getArticlesCollection();
      const doc = await articles.findOne({ _id: new ObjectId(input.id) });
      if (!doc) return null;

      const users = await getUsersCollection();
      const author = await users.findOne({ _id: doc.authorId });

      return {
        id: doc._id.toHexString(),
        title: doc.title,
        content: doc.content,
        coverImage: doc.coverImage,
        authorId: doc.authorId.toHexString(),
        authorName: author?.name ?? 'Unknown',
        authorEmail: author?.email ?? '',
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
    }),

  /**
   * Create article (protected)
   */
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(3, 'Title must be at least 3 characters'),
      content: z.string().min(10, 'Content must be at least 10 characters'),
      coverImage: z.string().url('Must be a valid URL'),
    }))
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
    .input(z.object({
      id: z.string(),
      title: z.string().min(3).optional(),
      content: z.string().min(10).optional(),
      coverImage: z.string().url().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ObjectId.isValid(input.id)) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Article not found' });
      }

      const articles = await getArticlesCollection();
      const doc = await articles.findOne({ _id: new ObjectId(input.id) });

      if (!doc) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Article not found' });
      }

      if (doc.authorId.toHexString() !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own articles' });
      }

      const { id, ...updates } = input;
      await articles.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } },
      );

      return { id };
    }),

  /**
   * Delete article (protected - must be the author)
   */
  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ObjectId.isValid(input.id)) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Article not found' });
      }

      const articles = await getArticlesCollection();
      const doc = await articles.findOne({ _id: new ObjectId(input.id) });

      if (!doc) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Article not found' });
      }

      if (doc.authorId.toHexString() !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only delete your own articles' });
      }

      await articles.deleteOne({ _id: new ObjectId(input.id) });
      return { success: true };
    }),

  /**
   * Search articles by title, content, or author name (public)
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(200),
      limit: z.number().min(1).max(100).optional().default(50),
    }))
    .query(async ({ input }): Promise<Article[]> => {
      const articles = await getArticlesCollection();
      const users = await getUsersCollection();

      // Phase 1: Find authors matching the query by name
      const escapedQuery = input.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matchingAuthors = await users
        .find({ name: { $regex: escapedQuery, $options: 'i' } })
        .toArray();
      const matchingAuthorIds = matchingAuthors.map((a) => a._id);

      // Phase 2: Search articles by text index OR by matching author
      const filter: Record<string, unknown> = {};
      const conditions: Record<string, unknown>[] = [];

      // Text search on title+content
      conditions.push({ $text: { $search: input.query } });

      // Articles by matching authors
      if (matchingAuthorIds.length > 0) {
        conditions.push({ authorId: { $in: matchingAuthorIds } });
      }

      filter.$or = conditions;

      const docs = await articles
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(input.limit)
        .toArray();

      // Phase 3: Resolve author names
      const authorIds = [...new Set(docs.map((d) => d.authorId.toHexString()))];
      const authorDocs = await users
        .find({ _id: { $in: authorIds.map((id) => new ObjectId(id)) } })
        .toArray();
      const authorMap = new Map(authorDocs.map((a) => [a._id.toHexString(), a]));

      return docs.map((doc) => {
        const author = authorMap.get(doc.authorId.toHexString());
        return {
          id: doc._id.toHexString(),
          title: doc.title,
          content: doc.content,
          coverImage: doc.coverImage,
          authorId: doc.authorId.toHexString(),
          authorName: author?.name ?? 'Unknown',
          authorEmail: author?.email ?? '',
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };
      });
    }),

  /**
   * Get articles by current user (protected)
   */
  getMyArticles: protectedProcedure
    .input(z.object({
      page: z.number().min(1).optional().default(1),
      limit: z.number().min(1).max(100).optional().default(10),
    }))
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
        items: docs.map((doc) => ({
          id: doc._id.toHexString(),
          title: doc.title,
          content: doc.content,
          coverImage: doc.coverImage,
          authorId: doc.authorId.toHexString(),
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })),
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),
});
