import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TokenDTO } from 'src/types';
import * as admin from 'firebase-admin';

@Injectable()
export class PushNotificationService {
  constructor(private prisma: PrismaService) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert('src/firebase-service-account.json'),
      });
    }
  }

  async sendNotifications(title: string, body: string) {
    const tokens = await this.prisma.notificationToken.findMany();
    if (!tokens || !tokens.length) return;

    return await this.sendNotification(
      tokens.map((token) => token.token),
      title,
      body,
    );
  }

  async saveToken(tokenPayload: TokenDTO & { userId: number }) {
    const tokenExists = await this.prisma.notificationToken.count({
      where: {
        user: { id: tokenPayload.userId },
      },
    });
    if (tokenExists) {
      return null;
    }

    console.info(
      `Successfully created device token ${tokenPayload.token} for user ${tokenPayload.userId}`,
    );
    return await this.prisma.notificationToken.create({
      data: {
        token: tokenPayload.token,
        user: { connect: { id: tokenPayload.userId } },
      },
    });
  }

  async sendNotification(
    tokens: string[], // Device tokens to send notifications to
    title: string,
    body: string,
    data: Record<string, any> = {},
  ): Promise<void> {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data,
        tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log('Notifications sent successfully:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
