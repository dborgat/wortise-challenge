import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { getDb, getClient } from "./mongo";
import { initializeIndexes } from "./collections";

async function testConnection() {
  try {
    console.log("🔄 Testing MongoDB connection...");

    const client = await getClient();
    console.log("✅ Connected to MongoDB");

    const db = await getDb();
    const collections = await db.listCollections().toArray();
    console.log("✅ Database accessible");
    console.log(
      "📊 Existing collections:",
      collections.map((c) => c.name)
    );

    console.log("🔄 Creating indexes...");
    await initializeIndexes();

    console.log("✅ MongoDB setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

testConnection();
