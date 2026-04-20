import { Injectable } from '@nestjs/common';
import type { IKafkaProducer } from '@org/core';
import type { AuthEvent } from '../../domain/events/index.js';

@Injectable()
export class AuthEventPublisher {
  constructor(private readonly kafkaProducer: IKafkaProducer) {}

  async publish(event: AuthEvent): Promise<void> {
    const topic = this.getTopicForEvent(event.type);
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

  async publishBatch(events: AuthEvent[]): Promise<void> {
    const messagesByTopic = new Map<
      string,
      { key?: string; value: string }[]
    >();

    for (const event of events) {
      const topic = this.getTopicForEvent(event.type);
      const message = {
        key: this.getKey(event),
        value: JSON.stringify({
          type: event.type,
          occurredAt: event.occurredAt.toISOString(),
          payload: this.serializeEvent(event),
        }),
      };

      if (!messagesByTopic.has(topic)) {
        messagesByTopic.set(topic, []);
      }
      messagesByTopic.get(topic)!.push(message);
    }

    for (const [topic, messages] of messagesByTopic) {
      await this.kafkaProducer.send(topic, messages);
    }
  }

  private getTopicForEvent(eventType: string): string {
    const topicMap: Record<string, string> = {
      'user.registered': 'auth.user.registered',
      'user.logged_in': 'auth.user.logged_in',
      'user.logged_out': 'auth.user.logged_out',
      'user.password_changed': 'auth.user.password_changed',
      'account.suspended': 'auth.account.suspended',
      'session.revoked': 'auth.session.revoked',
      'all_sessions.revoked': 'auth.all_sessions.revoked',
    };
    return topicMap[eventType] ?? 'auth.events';
  }

  private getKey(event: AuthEvent): string | undefined {
    if ('accountId' in event) {
      return event.accountId;
    }
    if ('sessionId' in event) {
      return event.sessionId;
    }
    return undefined;
  }

  private serializeEvent(event: AuthEvent): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(event)) {
      if (key !== 'type' && key !== 'occurredAt') {
        result[key] = value;
      }
    }
    return result;
  }
}
