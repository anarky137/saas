import { Injectable, Logger } from '@nestjs/common';
import type { IKafkaMessage } from './kafka.interface.js';

export type ProcessorHandler = (message: IKafkaMessage) => Promise<void>;

@Injectable()
export class KafkaProcessor {
  private readonly logger = new Logger(KafkaProcessor.name);
  private handlers: Map<string, ProcessorHandler> = new Map();
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;
  private retryDelay = 1000;

  register(topic: string, handler: ProcessorHandler): void {
    this.handlers.set(topic, handler);
    this.logger.log(`Registered processor for topic: ${topic}`);
  }

  async process(message: IKafkaMessage): Promise<void> {
    const handler = this.handlers.get(message.topic);
    if (!handler) {
      this.logger.warn(`No handler for topic: ${message.topic}`);
      return;
    }

    const retryKey = `${message.topic}-${message.key}`;
    const attempts = this.retryAttempts.get(retryKey) ?? 0;

    try {
      await handler(message);
      this.retryAttempts.delete(retryKey);
    } catch (error) {
      this.retryAttempts.set(retryKey, attempts + 1);

      if (attempts < this.maxRetries) {
        this.logger.warn(
          `Retry ${attempts + 1}/${this.maxRetries} for ${message.topic}`,
        );
        await this.delay(this.retryDelay * Math.pow(2, attempts));
        throw error;
      }

      this.logger.error(`Failed after ${attempts + 1} attempts: ${error}`);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export interface EventPayload<T = unknown> {
  readonly eventId: string;
  readonly eventType: string;
  readonly timestamp: Date;
  readonly aggregateId: string;
  readonly data: T;
  readonly metadata?: Record<string, unknown>;
}

export function createEvent<T>(
  eventType: string,
  aggregateId: string,
  data: T,
  metadata?: Record<string, unknown>,
): EventPayload<T> {
  return {
    eventId: crypto.randomUUID(),
    eventType,
    timestamp: new Date(),
    aggregateId,
    data,
    metadata,
  };
}
