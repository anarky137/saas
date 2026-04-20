import { DynamicModule, Module, Global } from '@nestjs/common';
import { CqrsModule as NestCqrsModule } from '@nestjs/cqrs';

export const COMMAND_HANDLERS = [];
export const QUERY_HANDLERS = [];
export const EVENT_HANDLERS = [];

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
      imports: [
        NestCqrsModule.forFeature(
          COMMAND_HANDLERS,
          QUERY_HANDLERS,
          EVENT_HANDLERS,
        ),
      ],
      exports: [NestCqrsModule],
    };
  }
}
