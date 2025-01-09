/*
  Warnings:

  - Made the column `matchDate` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "summarized" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "matchDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "GameStat" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;
