import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { AuthGuard } from '../auth/auth.guard';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService, AuthGuard, PrismaService],
})
export class PlayerModule {}
