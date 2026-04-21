import { Injectable, Logger } from '@nestjs/common';
import type { IKafkaProducer } from '@org/core';
import type { DomainEvent } from '../../domain/events/index.js';
import { TOPIC_BY_EVENT_TYPE } from '@org/contracts';

@Injectable()
export class AuthEventForwarder {
  private readonly logger = new Logger(AuthEventForwarder.name);
  private readonly forwardedEvents = new Set<string>();

  constructor(private readonly kafkaProducer?: IKafkaProducer) {}

  async forward(event: DomainEvent): Promise<void> {
    if (!this.kafkaProducer) {
      return;
    }

    const eventType = event.constructor.name;
    if (this.forwardedEvents.has(eventType)) {
      return;
    }

    try {
      const topic = TOPIC_BY_EVENT_TYPE[eventType] ?? 'auth.events';
      await this.kafkaProducer.send(topic, [
        {
          key: this.getKey(event),
          value: JSON.stringify({
            type: eventType,
            occurredAt: event.occurredAt.toISOString(),
            payload: this.serialize(event),
          }),
        },
      ]);
      this.logger.debug(`Forwarded event ${eventType} to Kafka topic ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to forward event ${eventType}: ${error}`);
    }
  }

  register(eventType: string): void {
    this.forwardedEvents.add(eventType);
    this.logger.log(`Will forward event type: ${eventType}`);
  }

  unregister(eventType: string): void {
    this.forwardedEvents.delete(eventType);
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

  private serialize(event: DomainEvent): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(event)) {
      if (key !== 'type' && key !== 'occurredAt') {
        result[key] = value;
      }
    }
    return result;
  }
}
