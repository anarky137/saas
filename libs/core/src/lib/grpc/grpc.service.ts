import { Injectable, Logger } from '@nestjs/common';
import type { GrpcClientOptions } from './grpc.interface.js';

@Injectable()
export class GrpcServer {
  private readonly logger = new Logger(GrpcServer.name);

  async start(): Promise<void> {
    this.logger.log('gRPC server ready');
  }

  async stop(): Promise<void> {
    this.logger.log('gRPC server stopped');
  }
}

@Injectable()
export class GrpcClientService {
  private readonly logger = new Logger(GrpcClientService.name);

  async createClient<T>(options: GrpcClientOptions): Promise<T> {
    this.logger.log(`Creating gRPC client: ${options.name}`);
    throw new Error('gRPC client requires @grpc/grpc-js package');
  }
}
