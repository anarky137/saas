import { Module, Global, DynamicModule } from '@nestjs/common';

export interface QueueModuleOptions {
  name?: string;
  redis?: {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
  };
}

@Global()
@Module({})
export class QueueModule {
  static forRoot(_options?: QueueModuleOptions): DynamicModule {
    return {
      module: QueueModule,
      providers: [],
      exports: [],
    };
  }

  static forFeature(_name: string): DynamicModule {
    return {
      module: QueueModule,
      providers: [],
      exports: [],
    };
  }
}
