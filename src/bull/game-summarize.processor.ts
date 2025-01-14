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
    const pointsForCleanSheet = 6;
    const pointsForSaves = 4;
    const pointsForAttendance = 2;

    for (const stat of gameStats) {
      const { player, id } = stat;

      // Calculate points for the player
      const totalPoints =
        stat.goal * pointsForGoals +
        stat.assists * pointsForAssists +
        (stat.saves >= 10 ? pointsForSaves : 0) +
        stat.cleanSheet * pointsForCleanSheet +
        (stat.played ? pointsForAttendance : 0);

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
        if (team.captainId === player.id) {
          await this.prisma.gameStat.update({
            where: { id },
            data: {
              points: {
                multiply: 2,
              },
            },
          });
        }
        // Update points for each UserTeam
        await this.prisma.userTeam.update({
          where: { id: team.id },
          data: {
            points:
              team.points +
              (team.captainId === player.id ? totalPoints * 2 : totalPoints),
          },
        });
      }
    }

    return { message: 'Game stats summarized and teams updated.' };
  }
}
