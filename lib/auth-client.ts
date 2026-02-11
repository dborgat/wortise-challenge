"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client for React components
 * Use this in Client Components for authentication
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

/**
 * Hook to get current user session
 */
export const useSession = () => {
  return authClient.useSession();
};
