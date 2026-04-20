import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { Queue, QueueOptions } from 'bull';

export interface QueueConfig {
  name: string;
  options?: QueueOptions;
}

export function createQueueConfig(name: string): QueueConfig {
  return {
    name,
    options: {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
      },
    },
  };
}

export function registerQueue(config: QueueConfig) {
  return BullModule.registerQueue(config);
}

@Global()
@Module({
  imports: [],
  exports: [BullModule],
})
export class QueueModule {}
