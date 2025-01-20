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

    if (
      gameStat.goal >= 5 ||
      (position === 'GK' && gameStat.saves >= 15) ||
      gameStat.assists >= 3 ||
      gameStat.cleanSheet >= 1
    ) {
      return await this.prisma.gameStat.update({
        where: { id: gameStat.id },
        data: {
          grade: 'S',
        },
      });
    } else if (
      gameStat.goal >= 2 ||
      (position === 'GK' && gameStat.saves >= 10) ||
      gameStat.assists >= 1
    ) {
      return await this.prisma.gameStat.update({
        where: { id: gameStat.id },
        data: {
          grade: 'A',
        },
      });
    } else {
      return await this.prisma.gameStat.update({
        where: { id: gameStat.id },
        data: {
          grade: 'F',
        },
      });
    }
  }
}
calculateGrade();
