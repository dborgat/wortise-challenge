import { router, publicProcedure, protectedProcedure } from '@/lib/trpc/init';
import { registerSchema, loginSchema } from '@/lib/validations/auth';
import { auth } from '@/lib/auth';
import { TRPCError } from '@trpc/server';
import { getArticlesCollection, getUsersCollection } from '@/server/db/collections';
import type { AuthorWithCount } from '@/types/article';

/**
 * Auth router
 * Handles authentication-related operations with Better Auth
 */
export const authRouter = router({
  /**
   * Get current user session
   */
  getSession: publicProcedure
    .query(async ({ ctx }) => {
      return ctx.user;
    }),

  /**
   * Register new user
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
          },
        });

        if (!result) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create account',
          });
        }

        return {
          success: true,
          user: result.user,
        };
      } catch (error: any) {
        // Handle Better Auth errors
        if (error.message?.includes('already exists')) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'An account with this email already exists',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create account',
        });
      }
    }),

  /**
   * Get current user profile
   */
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.user;
    }),

  /**
   * Get all authors with their article counts
   */
  getAuthors: publicProcedure
    .query(async (): Promise<AuthorWithCount[]> => {
      const articles = await getArticlesCollection();
      const users = await getUsersCollection();

      // Aggregate article counts per author
      const counts = await articles.aggregate<{ _id: string; count: number }>([
        { $group: { _id: { $toString: '$authorId' }, count: { $sum: 1 } } },
      ]).toArray();

      const countMap = new Map(counts.map((c) => [c._id, c.count]));

      // Fetch all users who have at least one article
      const authorIds = counts.map((c) => c._id);
      const { ObjectId } = await import('mongodb');
      const authorDocs = await users
        .find({ _id: { $in: authorIds.map((id) => new ObjectId(id)) } })
        .toArray();

      return authorDocs
        .map((doc) => ({
          id: doc._id.toHexString(),
          name: doc.name,
          email: doc.email,
          articleCount: countMap.get(doc._id.toHexString()) ?? 0,
        }))
        .sort((a, b) => b.articleCount - a.articleCount);
    }),
});
