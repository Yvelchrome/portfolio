import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import { PrismaClient } from "prisma/generated/client";

const connectionString = process.env["DATABASE_URL"] || "file:./prisma/dev.db";

let adapter: PrismaBetterSqlite3;
try {
  adapter = new PrismaBetterSqlite3({ url: connectionString });
} catch (error) {
  console.error("Failed to create Prisma adapter:", error);
  throw new Error("Database adapter initialization failed");
}

let prisma: PrismaClient;
try {
  prisma = new PrismaClient({ adapter });
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  throw new Error("Prisma client initialization failed");
}

export { prisma };
