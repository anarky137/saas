export interface KafkaTopic {
  name: string;
  partitions?: number;
  replicationFactor?: number;
}

export interface KafkaMessage<T = unknown> {
  topic: string;
  key?: string;
  value: T;
  timestamp: Date;
  headers?: Record<string, string>;
  partition?: number;
}

export interface KafkaConsumerGroup {
  groupId: string;
  topics: string[];
}

export const DEFAULT_TOPICS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  SESSION_CREATED: 'session.created',
  SESSION_REVOKED: 'session.revoked',
  EMAIL_SEND: 'email.send',
  NOTIFICATION_SEND: 'notification.send',
} as const;

export const DLQ_TOPIC = 'dlq';
export const EVENT_STORE_TOPIC = 'event-store';
