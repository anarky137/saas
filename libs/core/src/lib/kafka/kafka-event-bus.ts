import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  Kafka,
  Producer,
  Consumer,
  EachMessagePayload,
  logLevel,
} from 'kafkajs';
import { IKafkaMessage, KafkaRetryConfig } from './kafka.interface.js';
import { RETRY, ENV, DEFAULT_KAFKA_BROKERS } from '@org/shared';

@Injectable()
export class KafkaEventBus implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaEventBus.name);
  private readonly kafka: Kafka;
  private producer?: Producer;
  private consumers = new Map<string, Consumer>();
  private connected = false;

  constructor() {
    const clientId = ENV.KAFKA_CLIENT_ID ?? 'saas-app';
    const brokers =
      ENV.KAFKA_BROKERS.length > 0
        ? ENV.KAFKA_BROKERS
        : [DEFAULT_KAFKA_BROKERS[0]];

    this.kafka = new Kafka({
      clientId,
      brokers,
      logLevel: logLevel.WARN,
      retry: {
        initialRetryTime: RETRY.INITIAL_DELAY_MS,
        retries: RETRY.ATTEMPTS,
      },
    });
  }

  async connect(): Promise<void> {
    if (this.connected) return;

    this.producer = this.kafka.producer();
    await this.producer.connect();
    this.connected = true;
    this.logger.log('Kafka producer connected');
  }

  async send(
    topic: string,
    messages: { key?: string; value: string }[],
  ): Promise<void> {
    if (!this.producer) {
      await this.connect();
    }

    await this.producer!.send({
      topic,
      messages: messages.map((m) => ({
        key: m.key,
        value: m.value,
      })),
    });
    this.logger.debug(`Sent ${messages.length} messages to ${topic}`);
  }

  async subscribe(
    groupId: string,
    topics: string[],
    handler: (message: IKafkaMessage) => Promise<void>,
  ): Promise<Consumer> {
    const consumer = this.kafka.consumer({ groupId });

    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        const kafkaMessage: IKafkaMessage = {
          topic,
          key: message.key?.toString(),
          value: message.value?.toString() ?? '',
          timestamp: new Date(parseInt(message.timestamp)),
          headers: message.headers as Record<string, string> | undefined,
        };
        await handler(kafkaMessage);
      },
    });

    this.consumers.set(groupId, consumer);
    this.logger.log(`Consumer ${groupId} subscribed to ${topics.join(', ')}`);
    return consumer;
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
      this.producer = undefined;
    }

    for (const [groupId, consumer] of this.consumers) {
      await consumer.disconnect();
      this.logger.log(`Consumer ${groupId} disconnected`);
    }
    this.consumers.clear();
    this.connected = false;
    this.logger.log('Kafka disconnected');
  }

  isConnected(): boolean {
    return this.connected;
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }
}

export const kafkaRetryConfig: KafkaRetryConfig = {
  initialRetryTime: RETRY.INITIAL_DELAY_MS,
  maxRetryTime: RETRY.MAX_DELAY_MS,
  retries: RETRY.ATTEMPTS,
};
