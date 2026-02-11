import { appRouter } from '@/server/routers/_app';
import { createContext } from './context';

/**
 * Server-side tRPC caller
 * Used for server-side rendering and server actions
 */
export const createCaller = async () => {
  const context = await createContext();
  return appRouter.createCaller(context);
};

export { appRouter, createContext };
