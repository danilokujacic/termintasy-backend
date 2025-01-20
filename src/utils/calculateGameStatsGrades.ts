import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function calculateGrade() {
  const gameStats = await prisma.gameStat.findMany({
    include: {
      player: true,
    },
  });
  for (const gameStat of gameStats) {
    const { position } = gameStat.player;

    if (position === 'GK') {
      if (gameStat.saves > 15) {
        await prisma.gameStat.update({
          where: { id: gameStat.id },
          data: {
            grade: 'S',
          },
        });
      } else if (gameStat.saves > 10) {
        await prisma.gameStat.update({
          where: { id: gameStat.id },
          data: {
            grade: 'A',
          },
        });
      } else {
        await prisma.gameStat.update({
          where: { id: gameStat.id },
          data: {
            grade: 'F',
          },
        });
      }
    } else {
      if (gameStat.points > 30) {
        await prisma.gameStat.update({
          where: { id: gameStat.id },
          data: {
            grade: 'S',
          },
        });
      } else if (gameStat.points > 15) {
        await prisma.gameStat.update({
          where: { id: gameStat.id },
          data: {
            grade: 'A',
          },
        });
      } else {
        await prisma.gameStat.update({
          where: { id: gameStat.id },
          data: {
            grade: 'F',
          },
        });
      }
    }
  }
}
calculateGrade();
