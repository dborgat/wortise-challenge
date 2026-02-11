import { ObjectId } from 'mongodb';

/**
 * User type for the application
 * Matches the Better Auth user structure
 */
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session type for Better Auth
 */
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * User document in MongoDB (with ObjectId)
 */
export interface UserDocument {
  _id: ObjectId;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Account document for password storage
 */
export interface AccountDocument {
  _id: ObjectId;
  userId: ObjectId;
  accountId: string;
  providerId: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session document in MongoDB
 */
export interface SessionDocument {
  _id: ObjectId;
  userId: ObjectId;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}
