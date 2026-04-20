import { DynamicModule, Module, Global } from '@nestjs/common';
import {
  GrpcClientOptions,
  GrpcServerOptions,
  GRPC_SERVER_OPTIONS,
} from './grpc.interface';

@Global()
@Module({})
export class GrpcModule {
  static forClient(_options: GrpcClientOptions): DynamicModule {
    return {
      module: GrpcModule,
      providers: [],
      exports: [],
    };
  }

  static forServer(options: GrpcServerOptions): DynamicModule {
    return {
      module: GrpcModule,
      providers: [
        {
          provide: GRPC_SERVER_OPTIONS,
          useValue: options,
        },
      ],
      exports: [],
    };
  }

  static forRoot(options: GrpcServerOptions): DynamicModule {
    return {
      module: GrpcModule,
      global: true,
      providers: [
        {
          provide: GRPC_SERVER_OPTIONS,
          useValue: options,
        },
      ],
      exports: [],
    };
  }
}
