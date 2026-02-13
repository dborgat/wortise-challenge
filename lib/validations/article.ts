import { z } from "zod";

/**
 * Create article schema validation
 */
export const createArticleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(50000, "Content must be less than 50,000 characters"),
  coverImage: z
    .url("Must be a valid URL")
    .regex(
      /\.(jpg|jpeg|png|gif|webp)$/i,
      "Must be a valid image URL (jpg, jpeg, png, gif, webp)"
    ),
});

/**
 * Update article schema validation
 * All fields are optional for partial updates
 */
export const updateArticleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(50000, "Content must be less than 50,000 characters")
    .optional(),
  coverImage: z
    .string()
    .url("Must be a valid URL")
    .regex(
      /\.(jpg|jpeg|png|gif|webp)$/i,
      "Must be a valid image URL (jpg, jpeg, png, gif, webp)"
    )
    .optional(),
});

/**
 * Type inference from schemas
 */
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
