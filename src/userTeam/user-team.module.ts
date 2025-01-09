import { Module } from '@nestjs/common';
import { UserTeamController } from './user-team.controller';
import { UserTeamService } from './user-team.service';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  controllers: [UserTeamController],
  providers: [UserTeamService, PrismaService, AuthGuard],
})
export class UserTeamModule {}
