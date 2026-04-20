import { Injectable } from '@nestjs/common';

export interface QueueJob<T = unknown> {
  data: T;
  options?: {
    delay?: number;
    attempts?: number;
    backoff?: number | { type: 'exponential' | 'fixed'; delay: number };
    removeOnComplete?: boolean;
    removeOnFail?: boolean;
  };
}

@Injectable()
export class QueueService {
  async add<T>(
    _name: string,
    _data: T,
    _options?: QueueJob['options'],
  ): Promise<unknown> {
    throw new Error('Queue module requires @nestjs/bull package');
  }

  async getQueue(_name: string): Promise<unknown> {
    throw new Error('Queue module requires @nestjs/bull package');
  }

  async pause(): Promise<void> {
    throw new Error('Queue module requires @nestjs/bull package');
  }

  async resume(): Promise<void> {
    throw new Error('Queue module requires @nestjs/bull package');
  }
}
