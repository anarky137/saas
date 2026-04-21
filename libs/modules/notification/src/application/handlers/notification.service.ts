import { Injectable, Inject } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification';
import type { NotificationRepositoryPort } from '../../domain/ports/notification.repository.port';
import { NOTIFICATION_REPOSITORY } from '../../domain/ports/tokens';
import type { SendNotificationCommand } from '../commands/send-notification.command';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly repo: NotificationRepositoryPort,
  ) {}

  async sendNotification(cmd: SendNotificationCommand): Promise<Notification> {
    const notification = new Notification({
      id: crypto.randomUUID(),
      userId: cmd.userId,
      type: cmd.type,
      title: cmd.title,
      body: cmd.body,
      status: 'pending',
      sentAt: null,
      createdAt: new Date(),
    });

    return this.repo.save(notification);
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.repo.findByUserId(userId);
  }
}
