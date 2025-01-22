import { Body, Controller, Post, Req } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { TokenDTO } from 'src/types';

@Controller('push-notification')
export class PushNotificationController {
  constructor(private pushService: PushNotificationService) {}

  @Post('save-token')
  async saveToken(@Body() tokenPayload: TokenDTO, @Req() request: any) {
    return this.pushService.saveToken({
      ...tokenPayload,
      userId: request.user.sub,
    });
  }

  @Post('send-test-notification')
  async sendNotification() {
    return this.pushService.sendNotifications('Test', 'Test');
  }
}
