import { InjectionToken } from '@nestjs/common';
import type { Consumer } from 'kafkajs';

export const KAFKA_PRODUCER = Symbol.for('IKafkaProducer') as InjectionToken;
export const KAFKA_CONSUMER = Symbol.for('IKafkaConsumer') as InjectionToken;

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
}

export interface KafkaConsumerConfig {
  groupId: string;
  sessionTimeout: number;
  heartbeatInterval: number;
}

export interface KafkaRetryConfig {
  initialRetryTime: number;
  maxRetryTime?: number;
  retries: number;
}

export interface IKafkaMessage {
  readonly topic: string;
  readonly key?: string;
  readonly value: string;
  readonly timestamp: Date;
  readonly headers?: Record<string, string>;
}

export interface IKafkaProducer {
  send(
    topic: string,
    messages: { key?: string; value: string }[],
  ): Promise<void>;
  isConnected(): boolean;
}

export interface IKafkaConsumer {
  subscribe(
    groupId: string,
    topics: string[],
    handler: (message: IKafkaMessage) => Promise<void>,
  ): Promise<Consumer>;
  disconnect(): Promise<void>;
}
