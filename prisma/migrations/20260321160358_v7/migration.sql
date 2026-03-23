/*
  Warnings:

  - You are about to drop the `SentEmail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SentEmail";
PRAGMA foreign_keys=on;
