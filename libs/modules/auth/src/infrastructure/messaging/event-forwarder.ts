import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBus, IEventHandler } from '@nestjs/cqrs';
import type { IKafkaProducer } from '@org/core';
import type { DomainEvent } from '../../domain/events/index.js';
import { TOPIC_BY_EVENT_TYPE } from '@org/contracts';

@Injectable()
export class AuthEventForwarder
  implements OnModuleInit, IEventHandler<DomainEvent>
{
  private readonly logger = new Logger(AuthEventForwarder.name);
  private readonly forwardedEvents = new Set<string>();

  constructor(
    private readonly eventBus: EventBus,
    private readonly kafkaProducer?: IKafkaProducer,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.kafkaProducer) {
      this.eventBus.registerHandler(this);
      this.logger.log('EventForwarder registered to listen for events');
    }
  }

  async handle(event: DomainEvent): Promise<void> {
    if (!this.kafkaProducer) {
      return;
    }

    if (this.forwardedEvents.has(event.type)) {
      return;
    }

    try {
      const topic = TOPIC_BY_EVENT_TYPE[event.type] ?? 'auth.events';
      await this.kafkaProducer.send(topic, [
        {
          key: this.getKey(event),
          value: JSON.stringify({
            type: event.type,
            occurredAt: event.occurredAt.toISOString(),
            payload: this.serialize(event),
          }),
        },
      ]);
      this.logger.debug(
        `Forwarded event ${event.type} to Kafka topic ${topic}`,
      );
    } catch (error) {
      this.logger.error(`Failed to forward event ${event.type}: ${error}`);
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
