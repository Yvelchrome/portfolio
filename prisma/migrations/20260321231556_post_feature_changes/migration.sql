/*
  Warnings:

  - You are about to drop the `Config` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_email_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Config";
PRAGMA foreign_keys=on;

-- CreateIndex
CREATE INDEX "Message_repliedById_idx" ON "Message"("repliedById");
