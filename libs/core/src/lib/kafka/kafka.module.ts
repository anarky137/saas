import { Module, Global, DynamicModule } from '@nestjs/common';

export interface KafkaModuleOptions {
  clientId?: string;
  brokers?: string[];
  ssl?: boolean;
}

@Global()
@Module({})
export class KafkaModule {
  static forRoot(_options?: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [],
      exports: [],
    };
  }
}
