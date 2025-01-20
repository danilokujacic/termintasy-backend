import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import { BullModule } from '@nestjs/bullmq';
import { GameStatsProcessor } from '../bull/game-summarize.processor';
import { GameEndProcessor } from '../bull/game-end.processor';
import { GameStartProcessor } from 'src/bull/game-start.processor';

@Module({
  controllers: [GameController],
  imports: [
    BullModule.registerQueue({
      name: 'gameStatsQueue',
    }),
    BullModule.registerQueue({
      name: 'gameEndQueue',
    }),
    BullModule.registerQueue({
      name: 'gameStartProcessor',
    }),
  ],
  providers: [
    GameService,
    PrismaService,
    AuthGuard,
    GameStatsProcessor,
    GameEndProcessor,
    GameStartProcessor,
  ],
})
export class GameModule {}
