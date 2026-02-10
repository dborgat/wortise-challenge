import { Collection, ObjectId } from 'mongodb';
import { getDb } from './mongo';

/**
 * User document structure in MongoDB
 */
export interface UserDocument {
  _id: ObjectId;
  email: string;
  name: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Article document structure in MongoDB
 */
export interface ArticleDocument {
  _id: ObjectId;
  title: string;
  content: string;
  coverImage: string; // URL
  authorId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Collection names
 */
export const COLLECTIONS = {
  USERS: 'users',
  ARTICLES: 'articles',
} as const;

/**
 * Get users collection
 */
export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const db = await getDb();
  return db.collection<UserDocument>(COLLECTIONS.USERS);
}

/**
 * Get articles collection
 */
export async function getArticlesCollection(): Promise<Collection<ArticleDocument>> {
  const db = await getDb();
  return db.collection<ArticleDocument>(COLLECTIONS.ARTICLES);
}

/**
 * Initialize database indexes for optimal query performance
 * Run this once when setting up the database
 */
export async function initializeIndexes() {
  const db = await getDb();
  
  // Users collection indexes
  await db.collection(COLLECTIONS.USERS).createIndex(
    { email: 1 }, 
    { unique: true }
  );
  
  // Articles collection indexes
  await db.collection(COLLECTIONS.ARTICLES).createIndex({ authorId: 1 });
  await db.collection(COLLECTIONS.ARTICLES).createIndex({ title: 'text', content: 'text' });
  await db.collection(COLLECTIONS.ARTICLES).createIndex({ createdAt: -1 });
  
  console.log('✅ Database indexes created successfully');
}
