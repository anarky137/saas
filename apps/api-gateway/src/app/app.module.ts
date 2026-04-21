import { Module } from '@nestjs/common';
import {
  ConfigModule,
  HttpModule,
  HealthModule,
  GrpcModule,
  RedisModule,
} from '@org/core';
import { ENV, GRPC, PORT } from '@org/shared';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.forRoot({ timeout: 5000, retries: 3 }),
    HealthModule.forRoot({
      enableDisk: true,
      enableMemory: true,
      enableRedis: true,
      memoryThresholdMB: 200,
    }),
    GrpcModule.forClient({
      name: 'AUTH_SERVICE',
      package: GRPC.AUTH_PACKAGE,
      protoPath: GRPC.AUTH_PROTO,
      url: GRPC.AUTH_URL,
    }),
    GrpcModule.forClient({
      name: 'USER_SERVICE',
      package: GRPC.USER_PACKAGE,
      protoPath: GRPC.USER_PROTO,
      url: GRPC.USER_URL,
    }),
    RedisModule.forRoot({
      host: ENV.REDIS_HOST,
      port: ENV.REDIS_PORT,
      password: ENV.REDIS_PASSWORD,
      db: ENV.REDIS_DB,
      lazyConnect: true,
    }),
  ],
})
export class AppModule {}
