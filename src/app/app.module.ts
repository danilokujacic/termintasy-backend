import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { PlayerModule } from '../player/player.module';
import { GameModule } from '../game/game.module';
import { UserTeamModule } from '../userTeam/user-team.module';
import { BullModule } from '@nestjs/bullmq';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),

    AuthModule,
    PlayerModule,
    GameModule,
    UserTeamModule,
    PushNotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
