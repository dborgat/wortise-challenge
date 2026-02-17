import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getDb } from '@/server/db/mongo';
import { auth } from '@/lib/auth';
import type { User } from '@/types/auth';

/**
 * Creates context for tRPC requests
 * This context is available in all tRPC procedures
 */
export async function createContext(opts?: FetchCreateContextFnOptions) {
  // Get the database instance
  const db = await getDb();

  // Get user session from Better Auth
  let user: User | null = null;
  
  if (opts?.req) {
    try {
      const session = await auth.api.getSession({
        headers: opts.req.headers,
      });
      
      if (session?.user) {
        user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          emailVerified: session.user.emailVerified,
          image: session.user.image ?? undefined,
          createdAt: session.user.createdAt,
          updatedAt: session.user.updatedAt,
        };
      }
    } catch (error) {
      // Session not found or invalid - user stays null
      console.error('Error getting session:', error);
    }
  }

  return {
    db,
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
