import { Injectable, Logger } from '@nestjs/common';
import type { IKafkaMessage } from './kafka.interface.js';

export type ProcessorHandler = (message: IKafkaMessage) => Promise<void>;

export interface KafkaProcessorOptions {
  maxRetries?: number;
  retryDelay?: number;
  deadLetterTopic?: string;
  deadLetterHandler?: (message: IKafkaMessage, error: Error) => Promise<void>;
}

@Injectable()
export class KafkaProcessor {
  private readonly logger = new Logger(KafkaProcessor.name);
  private handlers: Map<string, ProcessorHandler> = new Map();
  private retryAttempts = new Map<string, number>();
  private deadLetterTopic?: string;
  private deadLetterHandler?: (
    message: IKafkaMessage,
    error: Error,
  ) => Promise<void>;
  private maxRetries: number;
  private retryDelay: number;

  constructor(options?: KafkaProcessorOptions) {
    this.maxRetries = options?.maxRetries ?? 3;
    this.retryDelay = options?.retryDelay ?? 1000;
    this.deadLetterTopic = options?.deadLetterTopic;
    this.deadLetterHandler = options?.deadLetterHandler;
  }

  register(topic: string, handler: ProcessorHandler): void {
    this.handlers.set(topic, handler);
    this.logger.log(`Registered processor for topic: ${topic}`);
  }

  registerDeadLetter(
    topic: string,
    handler: (message: IKafkaMessage, error: Error) => Promise<void>,
  ): void {
    this.deadLetterTopic = topic;
    this.deadLetterHandler = handler;
    this.logger.log(`Registered dead letter topic: ${topic}`);
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
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.retryAttempts.set(retryKey, attempts + 1);

      if (attempts < this.maxRetries) {
        this.logger.warn(
          `Retry ${attempts + 1}/${this.maxRetries} for ${message.topic}`,
        );
        await this.delay(this.retryDelay * Math.pow(2, attempts));
        throw error;
      }

      if (this.deadLetterTopic && this.deadLetterHandler) {
        this.logger.error(
          `Max retries exceeded, sending to DLQ: ${this.deadLetterTopic}`,
        );
        await this.deadLetterHandler(message, errorObj);
      } else {
        this.logger.error(
          `Failed after ${attempts + 1} attempts, no DLQ configured: ${errorObj.message}`,
        );
      }

      this.retryAttempts.delete(retryKey);
      throw error;
    }
  }

  async retry(message: IKafkaMessage): Promise<void> {
    const retryKey = `${message.topic}-${message.key}`;
    const attempts = this.retryAttempts.get(retryKey) ?? 0;
    this.retryAttempts.set(retryKey, attempts + 1);
    await this.delay(this.retryDelay * Math.pow(2, attempts));
  }

  resetRetry(message: IKafkaMessage): void {
    const retryKey = `${message.topic}-${message.key}`;
    this.retryAttempts.delete(retryKey);
  }

  getRetryCount(message: IKafkaMessage): number {
    const retryKey = `${message.topic}-${message.key}`;
    return this.retryAttempts.get(retryKey) ?? 0;
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

export const DEFAULT_DLQ_TOPIC = 'dlq';
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
