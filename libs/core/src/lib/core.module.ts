import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CryptoModule } from './crypto/crypto.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { GraphQLModule } from './graphql/gateway.module';
import { KafkaModule } from './kafka/kafka.module';
import { QueueModule } from './queue/queue.module';
import { HttpModule } from './http/http.module';
import { GrpcModule } from './grpc/grpc.module';
import { AppCqrsModule } from './cqrs/cqrs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(),
    CryptoModule.forRoot(),
    RedisModule.forRoot(),
    HttpModule.forRoot(),
    GrpcModule.forRoot({ package: '', protoPath: '', url: '' }),
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
