import { Injectable, OnModuleDestroy } from '@nestjs/common';

export interface RedisOptions {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  async getClient(_name: string = 'default'): Promise<unknown> {
    throw new Error('Redis module requires ioredis package');
  }

  async connect(_name: string = 'default'): Promise<unknown> {
    throw new Error('Redis module requires ioredis package');
  }

  async get(_key: string, _name: string = 'default'): Promise<string | null> {
    throw new Error('Redis module requires ioredis package');
  }

  async set(
    _key: string,
    _value: string,
    _ttl?: number,
    _name: string = 'default',
  ): Promise<void> {
    throw new Error('Redis module requires ioredis package');
  }

  async del(_key: string, _name: string = 'default'): Promise<number> {
    throw new Error('Redis module requires ioredis package');
  }

  async ping(): Promise<string> {
    throw new Error('Redis module requires ioredis package');
  }

  async onModuleDestroy(): Promise<void> {
    // Cleanup
  }
}
