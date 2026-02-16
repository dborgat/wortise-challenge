import { headers } from 'next/headers';
import { appRouter } from '@/server/routers/_app';
import { createContext } from './context';

/**
 * Server-side tRPC caller
 * Used for server-side rendering and server actions
 */
export const createCaller = async () => {
  const reqHeaders = await headers();
  const context = await createContext({
    req: new Request('https://localhost', { headers: reqHeaders }),
    resHeaders: new Headers(),
  });
  return appRouter.createCaller(context);
};

export { appRouter, createContext };
