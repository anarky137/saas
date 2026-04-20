import { Injectable, OnModuleDestroy } from '@nestjs/common';

export interface IKafkaMessageHandler {
  handle(payload: unknown): Promise<void>;
}

@Injectable()
export class KafkaService implements OnModuleDestroy {
  async subscribe(
    _topic: string,
    _handler: IKafkaMessageHandler,
  ): Promise<void> {
    throw new Error('Kafka module requires kafkajs package');
  }

  async publish(
    _topic: string,
    _messages: { key?: string; value: string }[],
  ): Promise<void> {
    throw new Error('Kafka module requires kafkajs package');
  }

  async onModuleDestroy(): Promise<void> {
    // Cleanup
  }
}
