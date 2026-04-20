import { Module, Global, DynamicModule, ValueProvider } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

export interface QueueModuleOptions {
  name?: string;
  redis?: {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
  };
}

export interface QueueModuleAsyncOptions {
  useFactory: () => Promise<QueueModuleOptions> | QueueModuleOptions;
  imports?: Function[];
}

@Global()
@Module({})
export class QueueModule {
  static forRoot(options: QueueModuleOptions = {}): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.forRoot({
          redis: {
            host: options.redis?.host ?? process.env.REDIS_HOST ?? 'localhost',
            port:
              options.redis?.port ?? parseInt(process.env.REDIS_PORT ?? '6379'),
            password: options.redis?.password ?? process.env.REDIS_PASSWORD,
            db: options.redis?.db ?? parseInt(process.env.REDIS_DB ?? '0'),
          },
        }),
      ],
      exports: [BullModule],
    };
  }

  static forRootAsync(options: QueueModuleAsyncOptions): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          useFactory: async () => {
            const opts = await options.useFactory();
            return {
              redis: {
                host: opts.redis?.host ?? process.env.REDIS_HOST ?? 'localhost',
                port:
                  opts.redis?.port ??
                  parseInt(process.env.REDIS_PORT ?? '6379'),
                password: opts.redis?.password ?? process.env.REDIS_PASSWORD,
                db: opts.redis?.db ?? parseInt(process.env.REDIS_DB ?? '0'),
              },
            };
          },
        }),
      ],
      exports: [BullModule],
      imports: options.imports ?? [],
    };
  }

  static forFeature(name: string): DynamicModule {
    return {
      module: QueueModule,
      imports: [BullModule.registerQueue({ name })],
      exports: [BullModule],
    };
  }

  static forFeatureAsync(
    name: string,
    options: QueueModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: QueueModule,
      imports: [BullModule.registerQueueAsync({ name })],
      exports: [BullModule],
    };
  }
}
