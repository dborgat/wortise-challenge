/**
 * Article with author information
 * Used in frontend
 */
export interface Article {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Article without author details
 * Used for user's own articles
 */
export interface MyArticle {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
