import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { KAFKA_CONSUMER } from '@org/core';
import type { IKafkaConsumer, IKafkaMessage } from '@org/core';
import type { UserEvent } from '@org/contracts';
import { NotificationService } from '../../application/handlers/notification.service';

@Injectable()
export class UserEventListener implements OnModuleInit {
  private readonly logger = new Logger(UserEventListener.name);

  constructor(
    @Inject(KAFKA_CONSUMER) private readonly kafkaConsumer: IKafkaConsumer | undefined,
    private readonly notificationService: NotificationService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!this.kafkaConsumer) {
      this.logger.warn('Kafka consumer not available');
      return;
    }
    await this.kafkaConsumer.subscribe(['user.events'], this.handleMessage.bind(this));
    this.logger.log('UserEventListener subscribed to user.events');
  }

  private async handleMessage(message: IKafkaMessage): Promise<void> {
    try {
      const event: UserEvent = JSON.parse(message.value as string);
      
      switch (event.type) {
        case 'user.created':
          await this.handleUserCreated(event);
          break;
      }
    } catch (error) {
      this.logger.error(`Failed to process: ${error}`);
    }
  }

  private async handleUserCreated(event: UserEvent): Promise<void> {
    const payload = event.payload as { userId: string; email: string | null };
    if (payload.email) {
      await this.notificationService.sendNotification({
        userId: payload.userId,
        type: 'email',
        title: 'Welcome!',
        body: 'Your account has been created successfully.',
      });
    }
    this.logger.log(`Welcome notification sent for user: ${payload.userId}`);
  }
}
