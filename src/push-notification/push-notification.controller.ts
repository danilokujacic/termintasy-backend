import { Body, Controller, Post } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { TokenDTO } from 'src/types';

@Controller('push-notification')
export class PushNotificationController {
  constructor(private pushService: PushNotificationService) {}

  @Post('save-token')
  async saveToken(@Body() tokenPayload: TokenDTO) {
    return this.pushService.saveToken(tokenPayload);
  }

  @Post('send-test-notification')
  async sendNotification() {
    return this.pushService.sendNotifications('Test', 'Test');
  }
}
