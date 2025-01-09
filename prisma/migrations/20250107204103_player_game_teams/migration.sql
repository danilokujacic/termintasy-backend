/*
  Warnings:

  - You are about to drop the column `gameTeamId` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_gameTeamId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "gameTeamId";

-- CreateTable
CREATE TABLE "_PlayerTeams" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlayerTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlayerTeams_B_index" ON "_PlayerTeams"("B");

-- AddForeignKey
ALTER TABLE "_PlayerTeams" ADD CONSTRAINT "_PlayerTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "GameTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerTeams" ADD CONSTRAINT "_PlayerTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
