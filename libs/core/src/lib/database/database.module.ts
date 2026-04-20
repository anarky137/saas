import { Module, Global, DynamicModule } from '@nestjs/common';

export interface DatabaseModuleOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  ssl?: boolean;
  synchronize?: boolean;
  logging?: boolean;
}

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(_options?: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [],
      exports: [],
    };
  }
}
