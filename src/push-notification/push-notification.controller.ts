import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { TokenDTO } from 'src/types';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('push-notification')
export class PushNotificationController {
  constructor(private pushService: PushNotificationService) {}

  @UseGuards(AuthGuard)
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
