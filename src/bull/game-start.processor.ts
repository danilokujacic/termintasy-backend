import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PrismaService } from '../prisma.service';

@Processor('gameStartProcessor')
export class GameStartProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job) {
    const { gameId } = job.data;

    console.log(`Activating game with ID: ${gameId}`);

    // Update the game to active
    await this.prisma.game.update({
      where: { id: gameId },
      data: { active: true },
    });

    console.log(`Game with ID ${gameId} is now active.`);
  }
}
