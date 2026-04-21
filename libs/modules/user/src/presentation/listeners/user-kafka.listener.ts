import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { KAFKA_CONSUMER } from '@org/core';
import type { IKafkaConsumer, IKafkaMessage } from '@org/core';
import type { AuthEvent } from '@org/contracts';
import type { UserService } from '../../application/handlers/user.service';
import { UserCreatedEvent } from '../../domain/events/user.events';

@Injectable()
export class UserKafkaListener implements OnModuleInit {
  private readonly logger = new Logger(UserKafkaListener.name);

  constructor(
    @Inject(KAFKA_CONSUMER)
    private readonly kafkaConsumer: IKafkaConsumer | undefined,
    private readonly userService: UserService,
    private readonly eventBus: EventBus,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!this.kafkaConsumer) {
      this.logger.warn(
        'Kafka consumer not available, skipping Kafka listener setup',
      );
      return;
    }

    await this.kafkaConsumer.subscribe(
      'user-service-group',
      ['auth.events'],
      this.handleMessage.bind(this),
    );
    this.logger.log('UserKafkaListener subscribed to auth.events topic');
  }

  private async handleMessage(message: IKafkaMessage): Promise<void> {
    try {
      const event: AuthEvent = JSON.parse(message.value as string);

      switch (event.type) {
        case 'user.registered':
          await this.handleUserRegistered(event);
          break;
        default:
          this.logger.debug(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process Kafka message: ${error}`);
    }
  }

  private async handleUserRegistered(event: AuthEvent): Promise<void> {
    const payload = event.payload as {
      accountId: string;
      email: string | null;
    };

    const user = await this.userService.createUserFromAccount({
      accountId: payload.accountId,
      email: payload.email,
    });

    this.eventBus.publish(
      new UserCreatedEvent(user.id, user.accountId, user.email),
    );

    this.logger.log(`User created from auth event: ${user.id}`);
  }
}
