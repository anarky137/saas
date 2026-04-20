import {
  DynamicModule,
  Module,
  Global,
  Type,
  ForwardReference,
} from '@nestjs/common';
import { KafkaEventBus } from './kafka-event-bus.js';
import { KafkaProcessor } from './kafka.processor.js';

export interface KafkaModuleOptions {
  clientId?: string;
  groupId?: string;
}

export interface KafkaModuleAsyncOptions {
  useFactory: () => Promise<KafkaModuleOptions> | KafkaModuleOptions;
  imports?: (Type<unknown> | DynamicModule | ForwardReference)[];
}

@Global()
@Module({})
export class KafkaModule {
  static forRoot(): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        KafkaEventBus,
        {
          provide: KafkaProcessor,
          useValue: new KafkaProcessor(),
        },
      ],
      exports: [KafkaEventBus, KafkaProcessor],
    };
  }

  static forRootAsync(options: KafkaModuleAsyncOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        KafkaEventBus,
        {
          provide: KafkaProcessor,
          useValue: new KafkaProcessor(),
        },
      ],
      exports: [KafkaEventBus, KafkaProcessor],
      imports: options.imports ?? [],
    };
  }

  static forFeature(_topic: string): DynamicModule {
    return {
      module: KafkaModule,
      providers: [],
      exports: [],
    };
  }
}
