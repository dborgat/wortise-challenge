import { router, publicProcedure, protectedProcedure } from '@/lib/trpc/init';
import { registerSchema, loginSchema } from '@/lib/validations/auth';
import { auth } from '@/lib/auth';
import { TRPCError } from '@trpc/server';

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
});
