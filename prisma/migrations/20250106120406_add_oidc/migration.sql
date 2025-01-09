-- AlterTable
ALTER TABLE "User" ADD COLUMN     "openid" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
