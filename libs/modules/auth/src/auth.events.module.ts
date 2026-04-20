import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { AuthEventListener } from './presentation/listeners/auth.event-listener.js';
import type { IKafkaConsumer } from '@org/core';

const AUTH_TOPICS = [
  'auth.user.registered',
  'auth.user.logged_in',
  'auth.user.logged_out',
  'auth.user.password_changed',
  'auth.account.suspended',
  'auth.session.revoked',
  'auth.all_sessions.revoked',
];

@Module({
  providers: [AuthEventListener],
  exports: [AuthEventListener],
})
export class AuthEventsModule implements OnModuleInit {
  private readonly logger = new Logger(AuthEventsModule.name);

  constructor(
    private readonly listener: AuthEventListener,
    private readonly kafkaConsumer: IKafkaConsumer,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.kafkaConsumer.subscribe(AUTH_TOPICS, (message) =>
        this.listener.handle(message),
      );
      this.logger.log(`Subscribed to Kafka topics: ${AUTH_TOPICS.join(', ')}`);
    } catch (error) {
      this.logger.warn(`Failed to subscribe to Kafka topics: ${error}`);
    }
  }
}
