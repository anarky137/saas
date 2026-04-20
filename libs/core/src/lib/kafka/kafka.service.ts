import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Producer, EachMessagePayload } from 'kafkajs';
import { createKafkaConfig, createKafkaInstance } from './kafka.config';

export interface IKafkaMessageHandler {
  handle(payload: EachMessagePayload): Promise<void>;
}

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer | null = null;
  private producer: Producer | null = null;
  private handlers: Map<string, IKafkaMessageHandler> = new Map();

  async onModuleInit(): Promise<void> {
    const config = createKafkaConfig();
    this.kafka = createKafkaInstance(config);
  }

  async createConsumer(groupId: string): Promise<Consumer> {
    this.consumer = this.kafka.consumer({ groupId });
    await this.consumer.connect();
    return this.consumer;
  }

  async createProducer(): Promise<Producer> {
    this.producer = this.kafka.producer();
    await this.producer.connect();
    return this.producer;
  }

  async subscribe(topic: string, handler: IKafkaMessageHandler): Promise<void> {
    if (!this.consumer) {
      throw new Error('Consumer not initialized. Call createConsumer first.');
    }

    await this.consumer.subscribe({ topic, fromBeginning: false });
    this.handlers.set(topic, handler);

    await this.consumer.run({
      eachMessage: async (payload) => {
        const h = this.handlers.get(topic);
        if (h) {
          await h.handle(payload);
        }
      },
    });
  }

  async publish(
    topic: string,
    messages: { key?: string; value: string }[],
  ): Promise<void> {
    if (!this.producer) {
      throw new Error('Producer not initialized. Call createProducer first.');
    }

    await this.producer.send({
      topic,
      messages,
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
    if (this.producer) {
      await this.producer.disconnect();
    }
  }
}
