/*
  Warnings:

  - You are about to drop the column `userTeamId` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userTeamId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "userTeamId";

-- CreateTable
CREATE TABLE "_PlayerUserTeams" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlayerUserTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlayerUserTeams_B_index" ON "_PlayerUserTeams"("B");

-- AddForeignKey
ALTER TABLE "_PlayerUserTeams" ADD CONSTRAINT "_PlayerUserTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerUserTeams" ADD CONSTRAINT "_PlayerUserTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
