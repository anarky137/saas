import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import type { IKafkaProducer } from '@org/core';
import type { DomainEvent } from '../../domain/events/index.js';
import {
  AUTH_TOPICS,
  TOPIC_BY_EVENT_TYPE,
  type AuthEvent,
} from '@org/contracts';

@Injectable()
export class AuthEventPublisher {
  private readonly logger = new Logger(AuthEventPublisher.name);

  constructor(
    private readonly eventBus: EventBus,
    private readonly kafkaProducer?: IKafkaProducer,
  ) {}

  async publishLocal(event: DomainEvent): Promise<void> {
    this.eventBus.publish(event);
  }

  async publishKafka(event: DomainEvent): Promise<void> {
    if (!this.kafkaProducer) {
      this.logger.warn('Kafka producer not configured, skipping');
      return;
    }

    const topic = TOPIC_BY_EVENT_TYPE[event.type] ?? 'auth.events';
    const message = {
      key: this.getKey(event),
      value: JSON.stringify({
        type: event.type,
        occurredAt: event.occurredAt.toISOString(),
        payload: this.serializeEvent(event),
      }),
    };

    await this.kafkaProducer.send(topic, [message]);
  }

  async publish(
    event: DomainEvent,
    options?: { local?: boolean; kafka?: boolean },
  ): Promise<void> {
    const shouldLocal = options?.local ?? true;
    const shouldKafka = options?.kafka ?? false;

    if (shouldLocal) {
      await this.publishLocal(event);
    }

    if (shouldKafka && this.kafkaProducer) {
      await this.publishKafka(event);
    }
  }

  async publishBatch(
    events: DomainEvent[],
    options?: { local?: boolean; kafka?: boolean },
  ): Promise<void> {
    for (const event of events) {
      await this.publish(event, options);
    }
  }

  private getKey(event: DomainEvent): string | undefined {
    if ('accountId' in event) {
      return (event as { accountId: string }).accountId;
    }
    if ('sessionId' in event) {
      return (event as { sessionId: string }).sessionId;
    }
    return undefined;
  }

  private serializeEvent(event: DomainEvent): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(event)) {
      if (key !== 'type' && key !== 'occurredAt') {
        result[key] = value;
      }
    }
    return result;
  }
}
