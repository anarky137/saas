import {
  Module,
  Global,
  DynamicModule,
  Type,
  ForwardReference,
} from '@nestjs/common';
import { RedisService } from './redis.service';
import { ENV, DEFAULT_PORTS } from '@org/shared';

const DEFAULT_REDIS_PORT = DEFAULT_PORTS.REDIS;

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
  imports?: (Type<unknown> | DynamicModule | ForwardReference)[];
}

const REDIS_OPTIONS = 'REDIS_OPTIONS';

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
            host: options.host ?? ENV.REDIS_HOST,
            port: options.port ?? ENV.REDIS_PORT ?? DEFAULT_REDIS_PORT,
            password: options.password ?? ENV.REDIS_PASSWORD,
            db: options.db ?? ENV.REDIS_DB,
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
              host: opts.host ?? ENV.REDIS_HOST,
              port: opts.port ?? ENV.REDIS_PORT ?? DEFAULT_REDIS_PORT,
              password: opts.password ?? ENV.REDIS_PASSWORD,
              db: opts.db ?? ENV.REDIS_DB,
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

  static forFeature(_name: string = 'default'): DynamicModule {
    return {
      module: RedisModule,
      providers: [],
      exports: [],
    };
  }
}
