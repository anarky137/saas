import { Kafka, Consumer, Producer, logLevel } from 'kafkajs';

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
  };
}

export function createKafkaConfig(): KafkaConfig {
  return {
    clientId: process.env.KAFKA_CLIENT_ID || 'saas-app',
    brokers: (process.env.KAFKA_BROKER || 'localhost:9092').split(','),
    ssl: process.env.KAFKA_SSL === 'true',
  };
}

export function createKafkaInstance(config: KafkaConfig): Kafka {
  return new Kafka({
    clientId: config.clientId,
    brokers: config.brokers,
    ssl: config.ssl,
    sasl: config.sasl,
    logLevel: logLevel.WARN,
  });
}

export async function createConsumer(
  kafka: Kafka,
  groupId: string,
): Promise<Consumer> {
  return kafka.consumer({ groupId });
}

export async function createProducer(kafka: Kafka): Promise<Producer> {
  return kafka.producer();
}
