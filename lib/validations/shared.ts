import { z } from "zod";

/**
 * Reusable ObjectId validation schema
 * Validates MongoDB ObjectId format (24 hex characters)
 */
export const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid ID format");
