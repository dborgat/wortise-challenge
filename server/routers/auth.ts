import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '@/lib/trpc/init';

/**
 * Auth router
 * Handles authentication-related operations
 * Will be integrated with Better Auth later
 */
export const authRouter = router({
  /**
   * Get current user session
   */
  getSession: publicProcedure
    .query(async ({ ctx }) => {
      // Placeholder - will implement with Better Auth later
      return ctx.user;
    }),

  /**
   * Register new user
   */
  register: publicProcedure
    .input(z.object({
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      name: z.string().min(2, 'Name must be at least 2 characters'),
    }))
    .mutation(async ({ input, ctx }) => {
      // Placeholder - will implement with Better Auth later
      return { success: true };
    }),

  /**
   * Login user
   */
  login: publicProcedure
    .input(z.object({
      email: z.string().email('Invalid email'),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Placeholder - will implement with Better Auth later
      return { success: true };
    }),

  /**
   * Logout user
   */
  logout: protectedProcedure
    .mutation(async ({ ctx }) => {
      // Placeholder - will implement with Better Auth later
      return { success: true };
    }),
});
