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
        homeTeam: {
          include: {
            players: true,
          },
        },
        awayTeam: {
          include: {
            players: true,
          },
        },
      },
    });

    if (!game) {
      throw new Error('Game not found');
    }

    console.log('end game', game);
    const allPlayers = [...game.homeTeam.players, ...game.awayTeam.players];
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

    // 3. Optionally, you could mark the game as inactive or update its status
    await this.prisma.game.update({
      where: { id: gameId },
      data: { active: false }, // Mark the game as inactive (optional)
    });
  }
}
