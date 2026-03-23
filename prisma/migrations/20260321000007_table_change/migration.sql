/*
  Warnings:

  - You are about to drop the `EmailLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmailLog";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SentEmail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resendId" TEXT,
    "to" TEXT NOT NULL,
    "recipientName" TEXT,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SentEmail_resendId_key" ON "SentEmail"("resendId");

-- CreateIndex
CREATE INDEX "SentEmail_status_idx" ON "SentEmail"("status");

-- CreateIndex
CREATE INDEX "SentEmail_resendId_idx" ON "SentEmail"("resendId");

-- CreateIndex
CREATE INDEX "SentEmail_createdAt_idx" ON "SentEmail"("createdAt");
