import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PrismaService } from '../prisma.service';

@Processor('gameEndQueue')
export class GameEndProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job) {
    const { gameId } = job.data;

    // Fetch all the player stats for the given game
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        gameStats: true,
      },
    });

    await this.prisma.player.updateMany({ data: { inGame: false } });

    if (!game) {
      throw new Error('Game not found');
    }

    const gameStats = game.gameStats.map((gameStat) => gameStat.id);

    await this.prisma.gameStat.updateMany({
      where: {
        id: {
          in: gameStats,
        },
      },
      data: {
        active: false,
      },
    });

    await this.prisma.userTeam.updateMany({
      data: {
        transfers: {
          increment: 1,
        },
      },
    });

    const freeHitTeam = await this.prisma.freeHitTeam.findMany({
      include: {
        userTeam: true,
        players: true,
      },
    });

    for (const freeHit of freeHitTeam) {
      await this.prisma.userTeam.update({
        where: {
          id: freeHit.userTeam.id,
        },
        data: {
          players: {
            set: freeHit.players.map((player) => ({ id: player.id })), // Set the new players
          },
        },
      });
      await this.prisma.freeHitTeam.delete({ where: { id: freeHit.id } });
    }

    // 3. Optionally, you could mark the game as inactive or update its status
    await this.prisma.game.update({
      where: { id: gameId },
      data: { active: false }, // Mark the game as inactive (optional)
    });
  }
}
