import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import {
  ClientGrpc,
  ClientsModule,
  Transport,
  MicroserviceOptions,
} from '@nestjs/microservices';
import {
  GrpcClientOptions,
  GrpcServerOptions,
  GRPC_SERVER_OPTIONS,
} from './grpc.interface';

@Injectable()
export class GrpcService implements OnModuleInit {
  private readonly logger = new Logger(GrpcService.name);
  private clients: Map<string, ClientGrpc> = new Map();

  constructor(
    @Inject(GRPC_SERVER_OPTIONS)
    private readonly serverOptions?: GrpcServerOptions,
  ) {}

  async onModuleInit() {
    // Server is initialized by NestJS microservice
  }

  getClient<T>(name: string): T {
    const client = this.clients.get(name);
    if (!client) {
      throw new Error(
        `gRPC client "${name}" not found. Use GrpcModule.forClient() to register it.`,
      );
    }
    return client.getService<T>(name);
  }

  addClient(name: string, client: ClientGrpc): void {
    this.clients.set(name, client);
  }
}
