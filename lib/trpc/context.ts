import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDb } from "@/server/db/mongo";

/**
 * Creates context for tRPC requests
 * This context is available in all tRPC procedures
 */
export async function createContext(opts?: FetchCreateContextFnOptions) {
  // Get the database instance
  const db = await getDb();

  // In the future, we'll add user session here from Better Auth
  // For now, we'll return the basic context
  return {
    db,
    // We'll add user session here after configuring Better Auth
    user: null, // Temporary - will be replaced with actual user type
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
