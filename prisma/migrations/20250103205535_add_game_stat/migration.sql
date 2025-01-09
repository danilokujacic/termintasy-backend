-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "homeScore" SET DEFAULT 0,
ALTER COLUMN "awayScore" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "GameStat" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,
    "goal" INTEGER NOT NULL DEFAULT 0,
    "cleanSheet" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameStat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameStat" ADD CONSTRAINT "GameStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStat" ADD CONSTRAINT "GameStat_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
