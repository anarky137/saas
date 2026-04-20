import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

export interface RedisOptions {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly clients: Map<string, Redis> = new Map();

  async getClient(name: string = 'default'): Promise<Redis> {
    let client = this.clients.get(name);
    if (!client) {
      client = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
        lazyConnect: true,
      });
      this.clients.set(name, client);
    }
    return client;
  }

  async connect(name: string = 'default'): Promise<Redis> {
    const client = await this.getClient(name);
    if (client.status === 'wait') {
      await client.connect();
    }
    return client;
  }

  async get(key: string, name: string = 'default'): Promise<string | null> {
    const client = await this.getClient(name);
    return client.get(key);
  }

  async set(
    key: string,
    value: string,
    ttl?: number,
    name: string = 'default',
  ): Promise<void> {
    const client = await this.getClient(name);
    if (ttl) {
      await client.setex(key, ttl, value);
    } else {
      await client.set(key, value);
    }
  }

  async del(key: string, name: string = 'default'): Promise<number> {
    const client = await this.getClient(name);
    return client.del(key);
  }

  async exists(key: string, name: string = 'default'): Promise<boolean> {
    const client = await this.getClient(name);
    const result = await client.exists(key);
    return result === 1;
  }

  async expire(
    key: string,
    ttl: number,
    name: string = 'default',
  ): Promise<void> {
    const client = await this.getClient(name);
    await client.expire(key, ttl);
  }

  async incr(key: string, name: string = 'default'): Promise<number> {
    const client = await this.getClient(name);
    return client.incr(key);
  }

  async decr(key: string, name: string = 'default'): Promise<number> {
    const client = await this.getClient(name);
    return client.decr(key);
  }

  async hset(
    key: string,
    field: string,
    value: string,
    name: string = 'default',
  ): Promise<void> {
    const client = await this.getClient(name);
    await client.hset(key, field, value);
  }

  async hget(
    key: string,
    field: string,
    name: string = 'default',
  ): Promise<string | null> {
    const client = await this.getClient(name);
    return client.hget(key, field);
  }

  async hgetall(
    key: string,
    name: string = 'default',
  ): Promise<Record<string, string>> {
    const client = await this.getClient(name);
    return client.hgetall(key);
  }

  async publish(
    channel: string,
    message: string,
    name: string = 'default',
  ): Promise<number> {
    const client = await this.getClient(name);
    return client.publish(channel, message);
  }

  async onModuleDestroy(): Promise<void> {
    for (const client of this.clients.values()) {
      await client.quit();
    }
  }
}
