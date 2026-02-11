import { Collection, ObjectId } from 'mongodb';
import { getDb } from './mongo';
import type { UserDocument, AccountDocument, SessionDocument } from '@/types/auth';

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
  USERS: 'user',      // Better Auth uses singular 'user'
  ACCOUNTS: 'account', // For password storage
  SESSIONS: 'session', // For session management
  ARTICLES: 'articles',
} as const;

// Re-export auth types
export type { UserDocument, AccountDocument, SessionDocument };

/**
 * Get users collection
 */
export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const db = await getDb();
  return db.collection<UserDocument>(COLLECTIONS.USERS);
}

/**
 * Get accounts collection
 */
export async function getAccountsCollection(): Promise<Collection<AccountDocument>> {
  const db = await getDb();
  return db.collection<AccountDocument>(COLLECTIONS.ACCOUNTS);
}

/**
 * Get sessions collection
 */
export async function getSessionsCollection(): Promise<Collection<SessionDocument>> {
  const db = await getDb();
  return db.collection<SessionDocument>(COLLECTIONS.SESSIONS);
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
  
  // Accounts collection indexes
  await db.collection(COLLECTIONS.ACCOUNTS).createIndex({ userId: 1 });
  await db.collection(COLLECTIONS.ACCOUNTS).createIndex(
    { accountId: 1, providerId: 1 },
    { unique: true }
  );
  
  // Sessions collection indexes
  await db.collection(COLLECTIONS.SESSIONS).createIndex({ token: 1 }, { unique: true });
  await db.collection(COLLECTIONS.SESSIONS).createIndex({ userId: 1 });
  await db.collection(COLLECTIONS.SESSIONS).createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 } // TTL index - auto-delete expired sessions
  );
  
  // Articles collection indexes
  await db.collection(COLLECTIONS.ARTICLES).createIndex({ authorId: 1 });
  await db.collection(COLLECTIONS.ARTICLES).createIndex({ title: 'text', content: 'text' });
  await db.collection(COLLECTIONS.ARTICLES).createIndex({ createdAt: -1 });
  
  console.log('✅ Database indexes created successfully');
}
