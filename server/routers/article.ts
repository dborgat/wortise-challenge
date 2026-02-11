import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '@/lib/trpc/init';
import { TRPCError } from '@trpc/server';

/**
 * Article router
 * Handles all article-related operations
 */
export const articleRouter = router({
  /**
   * Get all articles (public)
   * TODO: Add pagination
   */
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      // Placeholder - will implement with MongoDB later
      return [];
    }),

  /**
   * Get article by ID (public)
   */
  getById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      // Placeholder - will implement with MongoDB later
      return null;
    }),

  /**
   * Create article (protected - requires authentication)
   */
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(3, 'Title must be at least 3 characters'),
      content: z.string().min(10, 'Content must be at least 10 characters'),
      coverImage: z.string().url('Must be a valid URL'),
    }))
    .mutation(async ({ input, ctx }) => {
      // Placeholder - will implement with MongoDB later
      return { id: 'temp-id', ...input };
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
      // Placeholder - will implement with MongoDB later
      return { id: input.id };
    }),

  /**
   * Delete article (protected - must be the author)
   */
  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Placeholder - will implement with MongoDB later
      return { success: true };
    }),

  /**
   * Get articles by current user (protected)
   */
  getMyArticles: protectedProcedure
    .query(async ({ ctx }) => {
      // Placeholder - will implement with MongoDB later
      return [];
    }),
});
