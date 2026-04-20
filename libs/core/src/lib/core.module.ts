import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { CryptoModule } from './crypto/crypto.module.js';
import { RedisModule } from './redis/redis.module.js';
import { HealthModule } from './health/health.module.js';
import { GraphQLModule } from './graphql/gateway.module.js';
import { KafkaModule } from './kafka/kafka.module.js';
import { QueueModule } from './queue/queue.module.js';
import { HttpModule } from './http/http.module.js';
import { GrpcModule } from './grpc/grpc.module.js';
import { AppCqrsModule } from './cqrs/cqrs.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(),
    CryptoModule.forRoot(),
    RedisModule.forRoot(),
    HttpModule.forRoot(),
    GrpcModule.forRoot(),
    HealthModule,
    GraphQLModule,
    KafkaModule.forRoot(),
    QueueModule.forRoot(),
    AppCqrsModule,
  ],
  exports: [
    ConfigModule,
    DatabaseModule,
    CryptoModule,
    RedisModule,
    HttpModule,
    GrpcModule,
    HealthModule,
    GraphQLModule,
    KafkaModule,
    QueueModule,
    AppCqrsModule,
  ],
})
export class OrgCoreModule {}
