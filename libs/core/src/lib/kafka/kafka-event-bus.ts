import { Injectable, Logger } from '@nestjs/common';
import { IKafkaMessage, KafkaRetryConfig } from './kafka.interface.js';

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
  initialRetryTime: 1000,
  maxRetryTime: 10000,
  retries: 3,
};
