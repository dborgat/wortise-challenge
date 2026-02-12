import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API handler
 * Handles all authentication requests at /api/auth/*
 */
export const { GET, POST } = toNextJsHandler(auth);
