import { DynamicModule, Module, Global } from '@nestjs/common';
import { CqrsModule as NestCqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [NestCqrsModule.forRoot()],
  exports: [NestCqrsModule],
})
export class AppCqrsModule {
  static forRoot(): DynamicModule {
    return {
      module: AppCqrsModule,
      imports: [NestCqrsModule.forRoot()],
      exports: [NestCqrsModule],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: AppCqrsModule,
      imports: [NestCqrsModule.forRoot()],
      exports: [NestCqrsModule],
    };
  }
}
