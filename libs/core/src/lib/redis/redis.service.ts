import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

export interface RedisOptions {
  host: string;
  port: number;
  password?: string;
  db?: number;
  lazyConnect?: boolean;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly clients = new Map<string, Redis>();

  async connect(
    options: RedisOptions,
    name: string = 'default',
  ): Promise<Redis> {
    if (this.clients.has(name)) {
      return this.clients.get(name)!;
    }

    const client = new Redis({
      host: options.host,
      port: options.port,
      password: options.password || undefined,
      db: options.db ?? 0,
      lazyConnect: options.lazyConnect ?? true,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    client.on('error', (err) => {
      this.logger.error(`Redis ${name} error: ${err.message}`);
    });

    client.on('connect', () => {
      this.logger.log(`Redis ${name} connected`);
    });

    this.clients.set(name, client);
    await client.connect();
    return client;
  }

  getClient(name: string = 'default'): Redis | undefined {
    return this.clients.get(name);
  }

  async get(key: string, name: string = 'default'): Promise<string | null> {
    const client = this.clients.get(name);
    if (!client) return null;
    return client.get(key);
  }

  async set(
    key: string,
    value: string,
    ttlSeconds?: number,
    name: string = 'default',
  ): Promise<void> {
    const client = this.clients.get(name);
    if (!client) return;

    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, value);
    } else {
      await client.set(key, value);
    }
  }

  async del(key: string, name: string = 'default'): Promise<number> {
    const client = this.clients.get(name);
    if (!client) return 0;
    return client.del(key);
  }

  async ping(): Promise<string> {
    const client = this.clients.get('default');
    if (!client) return 'PONG';
    return client.ping();
  }

  async onModuleDestroy(): Promise<void> {
    for (const [name, client] of this.clients) {
      await client.quit();
      this.logger.log(`Redis ${name} disconnected`);
    }
    this.clients.clear();
  }
}
