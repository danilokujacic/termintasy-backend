-- AlterEnum
ALTER TYPE "Position" ADD VALUE 'GK';

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;
