import {
  DynamicModule,
  Module,
  Global,
  Type,
  ForwardReference,
  OnModuleInit,
} from '@nestjs/common';
import { KafkaEventBus } from './kafka-event-bus.js';
import { KafkaProcessor } from './kafka.processor.js';
import { KAFKA_PRODUCER, KAFKA_CONSUMER } from './kafka.interface.js';

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
export class KafkaModule implements OnModuleInit {
  constructor(private readonly kafkaEventBus: KafkaEventBus) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaEventBus.connect();
  }

  static forRoot(): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        KafkaEventBus,
        {
          provide: KafkaProcessor,
          useValue: new KafkaProcessor(),
        },
        {
          provide: KAFKA_PRODUCER,
          useExisting: KafkaEventBus,
        },
        {
          provide: KAFKA_CONSUMER,
          useExisting: KafkaEventBus,
        },
      ],
      exports: [KafkaEventBus, KafkaProcessor, KAFKA_PRODUCER, KAFKA_CONSUMER],
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
        {
          provide: KAFKA_PRODUCER,
          useExisting: KafkaEventBus,
        },
        {
          provide: KAFKA_CONSUMER,
          useExisting: KafkaEventBus,
        },
      ],
      exports: [KafkaEventBus, KafkaProcessor, KAFKA_PRODUCER, KAFKA_CONSUMER],
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
