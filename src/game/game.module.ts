import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import { BullModule } from '@nestjs/bullmq';
import { GameStatsProcessor } from '../bull/game-summarize.processor';
import { GameEndProcessor } from '../bull/game-end.processor';

@Module({
  controllers: [GameController],
  imports: [
    BullModule.registerQueue({
      name: 'gameStatsQueue',
    }),
    BullModule.registerQueue({
      name: 'gameEndQueue',
    }),
  ],
  providers: [
    GameService,
    PrismaService,
    AuthGuard,
    GameStatsProcessor,
    GameEndProcessor,
  ],
})
export class GameModule {}
