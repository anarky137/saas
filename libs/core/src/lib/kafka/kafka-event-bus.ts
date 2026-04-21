import { Injectable, Logger } from '@nestjs/common';
import { IKafkaMessage, KafkaRetryConfig } from './kafka.interface.js';
import { RETRY } from '@org/shared';

@Injectable()
export class KafkaEventBus {
  private readonly logger = new Logger(KafkaEventBus.name);

  async send(
    _topic: string,
    _messages: { key?: string; value: string }[],
  ): Promise<void> {
    throw new Error('Kafka requires kafkajs package');
  }

  async subscribe(
    _topics: string[],
    _handler: (message: IKafkaMessage) => Promise<void>,
  ): Promise<void> {
    throw new Error('Kafka requires kafkajs package');
  }

  async disconnect(): Promise<void> {
    this.logger.log('Kafka disconnected');
  }

  isConnected(): boolean {
    return false;
  }
}

export const kafkaRetryConfig: KafkaRetryConfig = {
  initialRetryTime: RETRY.INITIAL_DELAY_MS,
  maxRetryTime: RETRY.MAX_DELAY_MS,
  retries: RETRY.ATTEMPTS,
};
