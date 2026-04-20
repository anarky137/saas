import { DynamicModule, Module, Global } from '@nestjs/common';
import { HttpService } from './http.service';
import type { HttpModuleOptions } from './http.interface';

@Global()
@Module({})
export class HttpModule {
  static forRoot(_options?: HttpModuleOptions): DynamicModule {
    return {
      module: HttpModule,
      providers: [HttpService],
      exports: [HttpService],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: HttpModule,
      providers: [HttpService],
      exports: [HttpService],
    };
  }
}
