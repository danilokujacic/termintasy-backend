import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PrismaService } from '../prisma.service';

@Processor('gameStatsQueue')
export class GameStatsProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job) {
    const { gameId } = job.data;

    // Fetch all the player stats for the given game
    const gameStats = await this.prisma.gameStat.findMany({
      where: { gameId },
      include: {
        player: true,
      },
    });

    // Define the points for each statistic type
    const pointsForGoals = 5;
    const pointsForAssists = 3;
    const pointsForCleanSheet = 2;

    for (const stat of gameStats) {
      const { player, id } = stat;

      // Calculate points for the player
      const totalPoints =
        stat.goal * pointsForGoals +
        stat.assists * pointsForAssists +
        stat.cleanSheet *
          pointsForCleanSheet *
          (player.position === 'DEF' || player.position === 'GK' ? 3 : 1);

      await this.prisma.gameStat.update({
        where: {
          id,
        },
        data: {
          points: totalPoints,
        },
      });
      // Fetch all UserTeams that this player belongs to (many-to-many)
      const userTeams = await this.prisma.player
        .findUnique({
          where: { id: player.id },
          select: {
            userTeams: true, // Get all the user teams the player belongs to
          },
        })
        .userTeams();

      for (const team of userTeams) {
        // Update points for each UserTeam
        await this.prisma.userTeam.update({
          where: { id: team.id },
          data: {
            points: team.points + totalPoints,
          },
        });
      }
    }

    return { message: 'Game stats summarized and teams updated.' };
  }
}
