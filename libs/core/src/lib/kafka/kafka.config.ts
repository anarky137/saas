export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
}

export function createKafkaConfig(): KafkaConfig {
  return {
    clientId: process.env.KAFKA_CLIENT_ID ?? 'saas-app',
    brokers: (process.env.KAFKA_BROKER ?? 'localhost:9092').split(','),
    ssl: process.env.KAFKA_SSL === 'true',
  };
}
