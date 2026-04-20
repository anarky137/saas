import { Injectable, Logger } from '@nestjs/common';
import type { IKafkaMessage } from '@org/core';
import type { AuthEvent } from '../../domain/events/index.js';

export type EventHandler = (event: AuthEvent) => Promise<void>;

@Injectable()
export class AuthEventListener {
  private readonly logger = new Logger(AuthEventListener.name);
  private handlers: Map<string, EventHandler> = new Map();

  register(eventType: string, handler: EventHandler): void {
    this.handlers.set(eventType, handler);
    this.logger.log(`Registered handler for: ${eventType}`);
  }

  async handle(message: IKafkaMessage): Promise<void> {
    const eventData = message.value as {
      type: string;
      payload: Record<string, unknown>;
    };

    const handler = this.handlers.get(eventData.type);
    if (!handler) {
      this.logger.debug(`No handler for event type: ${eventData.type}`);
      return;
    }

    try {
      const event = this.reconstructEvent(eventData.type, eventData.payload);
      await handler(event);
      this.logger.debug(`Handled event: ${eventData.type}`);
    } catch (error) {
      this.logger.error(`Error handling event ${eventData.type}: ${error}`);
      throw error;
    }
  }

  private reconstructEvent(
    type: string,
    payload: Record<string, unknown>,
  ): AuthEvent {
    switch (type) {
      case 'user.registered':
        return {
          type,
          occurredAt: new Date(payload['occurredAt'] as string),
          accountId: payload['accountId'] as string,
          email: payload['email'] as string | null,
        };
      case 'user.logged_in':
        return {
          type,
          occurredAt: new Date(payload['occurredAt'] as string),
          accountId: payload['accountId'] as string,
          sessionId: payload['sessionId'] as string,
          provider: payload['provider'] as string,
        };
      case 'user.logged_out':
        return {
          type,
          occurredAt: new Date(payload['occurredAt'] as string),
          accountId: payload['accountId'] as string,
          sessionId: payload['sessionId'] as string,
        };
      case 'user.password_changed':
        return {
          type,
          occurredAt: new Date(payload['occurredAt'] as string),
          accountId: payload['accountId'] as string,
        };
      case 'account.suspended':
        return {
          type,
          occurredAt: new Date(payload['occurredAt'] as string),
          accountId: payload['accountId'] as string,
        };
      case 'session.revoked':
        return {
          type,
          occurredAt: new Date(payload['occurredAt'] as string),
          accountId: payload['accountId'] as string,
          sessionId: payload['sessionId'] as string,
          reason: payload['reason'] as string | undefined,
        };
      case 'all_sessions.revoked':
        return {
          type,
          occurredAt: new Date(payload['occurredAt'] as string),
          accountId: payload['accountId'] as string,
          reason: payload['reason'] as string | undefined,
        };
      default:
        throw new Error(`Unknown event type: ${type}`);
    }
  }
}
