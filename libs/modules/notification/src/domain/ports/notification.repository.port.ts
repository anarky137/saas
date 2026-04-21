import { Notification } from '../entities/notification';

export interface INotificationRepository {
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string): Promise<Notification[]>;
  save(notification: Notification): Promise<Notification>;
  findPending(): Promise<Notification[]>;
}

export type NotificationRepositoryPort = INotificationRepository;
