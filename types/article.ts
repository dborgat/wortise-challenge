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

export interface PaginatedArticles {
  items: Article[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginatedMyArticles {
  items: MyArticle[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuthorWithCount {
  id: string;
  name: string;
  email: string;
  articleCount: number;
}
