import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import type { DomainEvent } from '../../domain/events/index.js';

@Injectable()
export class AuthEventPublisher {
  constructor(private readonly eventBus: EventBus) {}

  async publish(event: DomainEvent): Promise<void> {
    this.eventBus.publish(event);
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      this.eventBus.publish(event);
    }
  }
}
