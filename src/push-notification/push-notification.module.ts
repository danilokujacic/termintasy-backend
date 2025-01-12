import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationController } from './push-notification.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PushNotificationService, PrismaService],
  controllers: [PushNotificationController],
})
export class PushNotificationModule {}
