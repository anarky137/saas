import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class AppCqrsModule {
  static forRoot(): DynamicModule {
    return {
      module: AppCqrsModule,
      providers: [],
      exports: [],
    };
  }
}
