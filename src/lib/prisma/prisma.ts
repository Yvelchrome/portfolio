import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";
import { PrismaClient } from "prisma/generated/client";

const connectionString = process.env["DATABASE_URL"];
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const prisma = new PrismaClient({
  accelerateUrl: connectionString,
}).$extends(withAccelerate());
