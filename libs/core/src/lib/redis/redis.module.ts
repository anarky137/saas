import { Module, Global, DynamicModule, ValueProvider } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface RedisModuleOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  name?: string;
  lazyConnect?: boolean;
}

export interface RedisModuleAsyncOptions {
  useFactory: () => Promise<RedisModuleOptions> | RedisModuleOptions;
  imports?: Function[];
}

const REDIS_OPTIONS = 'REDIS_OPTIONS';

export const RedisOptionsProvider: ValueProvider<RedisModuleOptions> = {
  provide: REDIS_OPTIONS,
  useValue: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB ?? '0'),
  },
};

@Global()
@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions = {}): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_OPTIONS,
          useValue: {
            host: options.host ?? process.env.REDIS_HOST ?? 'localhost',
            port: options.port ?? parseInt(process.env.REDIS_PORT ?? '6379'),
            password: options.password ?? process.env.REDIS_PASSWORD,
            db: options.db ?? parseInt(process.env.REDIS_DB ?? '0'),
            lazyConnect: options.lazyConnect ?? true,
          },
        },
        RedisService,
      ],
      exports: [RedisService, REDIS_OPTIONS],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_OPTIONS,
          useFactory: async () => {
            const opts = await options.useFactory();
            return {
              host: opts.host ?? process.env.REDIS_HOST ?? 'localhost',
              port: opts.port ?? parseInt(process.env.REDIS_PORT ?? '6379'),
              password: opts.password ?? process.env.REDIS_PASSWORD,
              db: opts.db ?? parseInt(process.env.REDIS_DB ?? '0'),
              lazyConnect: opts.lazyConnect ?? true,
            };
          },
        },
        RedisService,
      ],
      exports: [RedisService, REDIS_OPTIONS],
      imports: options.imports ?? [],
    };
  }

  static forFeature(name: string = 'default'): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: `REDIS_CLIENT_${name.toUpperCase()}`,
          useFactory: (redisService: RedisService) =>
            redisService.getClient(name),
          inject: [RedisService],
        },
      ],
      exports: [`REDIS_CLIENT_${name.toUpperCase()}`],
    };
  }
}
