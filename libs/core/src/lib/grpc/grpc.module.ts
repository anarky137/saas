import { DynamicModule, Module, Global } from '@nestjs/common';
import { GrpcServer, GrpcClientService } from './grpc.service.js';
import type { GrpcClientOptions, GrpcServerOptions } from './grpc.interface.js';

@Global()
@Module({})
export class GrpcModule {
  static forClient(_options: GrpcClientOptions): DynamicModule {
    return {
      module: GrpcModule,
      providers: [GrpcClientService],
      exports: [GrpcClientService],
    };
  }

  static forServer(_options: GrpcServerOptions): DynamicModule {
    return {
      module: GrpcModule,
      providers: [GrpcServer],
      exports: [GrpcServer],
    };
  }

  static forRoot(): DynamicModule {
    return {
      module: GrpcModule,
      global: true,
      providers: [GrpcServer, GrpcClientService],
      exports: [GrpcServer, GrpcClientService],
    };
  }
}
