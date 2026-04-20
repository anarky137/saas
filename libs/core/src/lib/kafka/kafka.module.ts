import { Module, Global, DynamicModule, ValueProvider } from '@nestjs/common';
import { KafkaService } from './kafka.service';

export interface KafkaModuleOptions {
  clientId?: string;
  brokers?: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
  };
}

export interface KafkaModuleAsyncOptions {
  useFactory: () => Promise<KafkaModuleOptions> | KafkaModuleOptions;
  imports?: Function[];
}

const KAFKA_OPTIONS = 'KAFKA_OPTIONS';

export const KafkaOptionsProvider: ValueProvider<KafkaModuleOptions> = {
  provide: KAFKA_OPTIONS,
  useValue: {
    clientId: process.env.KAFKA_CLIENT_ID ?? 'saas-app',
    brokers: (process.env.KAFKA_BROKER ?? 'localhost:9092').split(','),
    ssl: process.env.KAFKA_SSL === 'true',
  },
};

@Global()
@Module({})
export class KafkaModule {
  static forRoot(options: KafkaModuleOptions = {}): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: KAFKA_OPTIONS,
          useValue: {
            clientId:
              options.clientId ?? process.env.KAFKA_CLIENT_ID ?? 'saas-app',
            brokers:
              options.brokers ??
              (process.env.KAFKA_BROKER ?? 'localhost:9092').split(','),
            ssl: options.ssl ?? process.env.KAFKA_SSL === 'true',
            sasl: options.sasl,
          },
        },
        KafkaService,
      ],
      exports: [KafkaService, KAFKA_OPTIONS],
    };
  }

  static forRootAsync(options: KafkaModuleAsyncOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: KAFKA_OPTIONS,
          useFactory: async () => {
            const opts = await options.useFactory();
            return {
              clientId:
                opts.clientId ?? process.env.KAFKA_CLIENT_ID ?? 'saas-app',
              brokers:
                opts.brokers ??
                (process.env.KAFKA_BROKER ?? 'localhost:9092').split(','),
              ssl: opts.ssl ?? process.env.KAFKA_SSL === 'true',
              sasl: opts.sasl,
            };
          },
        },
        KafkaService,
      ],
      exports: [KafkaService, KAFKA_OPTIONS],
      imports: options.imports ?? [],
    };
  }
}
