import { Injectable, Inject } from '@nestjs/common';
import type { GrpcServerOptions } from './grpc.interface';

export const GRPC_SERVER_OPTIONS = 'GRPC_SERVER_OPTIONS';

@Injectable()
export class GrpcService {
  constructor(
    @Inject(GRPC_SERVER_OPTIONS)
    private readonly serverOptions?: GrpcServerOptions,
  ) {}

  getServerOptions(): GrpcServerOptions | undefined {
    return this.serverOptions;
  }
}
