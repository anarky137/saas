import { DynamicModule, Module, Global } from '@nestjs/common';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { GrpcService } from './grpc.service';
import {
  GrpcClientOptions,
  GrpcServerOptions,
  GRPC_SERVER_OPTIONS,
} from './grpc.interface';
import { ClientProviderOptions, ClientsModule } from '@nestjs/microservices';

@Global()
@Module({})
export class GrpcModule {
  static forClient(options: GrpcClientOptions): DynamicModule {
    const clientOptions: ClientProviderOptions = {
      name: options.name,
      transport: Transport.GRPC,
      options: {
        package: options.package,
        protoPath: options.protoPath,
        url: options.url,
        loader: options.loader,
      },
    };

    return {
      module: GrpcModule,
      imports: [ClientsModule.register([clientOptions])],
      exports: [ClientsModule, GrpcService],
      providers: [GrpcService],
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
        GrpcService,
      ],
      exports: [GrpcService],
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
