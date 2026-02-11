import { router } from '@/lib/trpc/init';
import { articleRouter } from './article';
import { authRouter } from './auth';

/**
 * Main tRPC router
 * Combines all sub-routers
 */
export const appRouter = router({
  article: articleRouter,
  auth: authRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
