import { Injectable } from '@nestjs/common';
import { InjectQueue, Processor } from '@nestjs/bull';
import { Queue, Job } from 'bull';

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
  constructor(@InjectQueue('default') private readonly defaultQueue: Queue) {}

  async add<T>(
    name: string,
    data: T,
    options?: QueueJob['options'],
  ): Promise<Job<T>> {
    return this.defaultQueue.add(name, data, {
      delay: options?.delay,
      attempts: options?.attempts ?? 3,
      backoff: options?.backoff ?? { type: 'exponential', delay: 1000 },
      removeOnComplete: options?.removeOnComplete ?? true,
      removeOnFail: options?.removeOnFail ?? false,
    });
  }

  async addToQueue<T>(
    queueName: string,
    name: string,
    data: T,
    options?: QueueJob['options'],
  ): Promise<Job<T>> {
    const queue = await this.getQueue(queueName);
    return queue.add(name, data, {
      delay: options?.delay,
      attempts: options?.attempts ?? 3,
      backoff: options?.backoff ?? { type: 'exponential', delay: 1000 },
    });
  }

  async getQueue(name: string): Promise<Queue> {
    return this.defaultQueue.client.getQueue(name);
  }

  async getJob(jobId: string): Promise<Job | null> {
    return this.defaultQueue.getJob(jobId);
  }

  async getJobs(types: string[]): Promise<Job[]> {
    return this.defaultQueue.getJobs(types);
  }

  async pause(): Promise<void> {
    await this.defaultQueue.pause();
  }

  async resume(): Promise<void> {
    await this.defaultQueue.resume();
  }

  async drain(): Promise<void> {
    await this.defaultQueue.empty();
  }

  async clean(
    grace: number,
    status: 'completed' | 'failed' | 'wait',
  ): Promise<string[]> {
    return this.defaultQueue.clean(grace, status);
  }
}
