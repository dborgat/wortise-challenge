import { initTRPC, TRPCError } from '@trpc/server';
import { type Context } from '@/lib/trpc/context';
import superjson from 'superjson';

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson, // Allows passing Date, Map, Set, etc. between client and server
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const middleware = t.middleware;

/**
 * Public procedure - can be called by anyone
 */
export const publicProcedure = t.procedure;

/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Now we know user is not null
    },
  });
});

/**
 * Protected procedure - requires authentication
 * Use this for any endpoint that needs a logged-in user
 */
export const protectedProcedure = t.procedure.use(isAuthenticated);
