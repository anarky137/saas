import { DynamicModule, Module, Global } from '@nestjs/common';
import { HttpService } from './http.service';
import { HttpModuleOptions, HTTP_MODULE_OPTIONS } from './http.interface';

@Global()
@Module({})
export class HttpModule {
  static forRoot(options?: HttpModuleOptions): DynamicModule {
    return {
      module: HttpModule,
      providers: [
        {
          provide: HTTP_MODULE_OPTIONS,
          useValue: options ?? {},
        },
        {
          provide: HttpService,
          useFactory: (opts: HttpModuleOptions) => new HttpService(opts),
          inject: [HTTP_MODULE_OPTIONS],
        },
      ],
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
