import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CryptoModule } from './crypto/crypto.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { GraphQLModule } from './graphql/gateway.module';
import { KafkaModule } from './kafka/kafka.module';
import { QueueModule } from './queue/queue.module';
import { AppCqrsModule } from './cqrs/cqrs.module';

@Module({
  imports: [
    DatabaseModule,
    CryptoModule,
    RedisModule,
    HealthModule,
    GraphQLModule,
    KafkaModule,
    QueueModule,
    AppCqrsModule,
  ],
  exports: [
    DatabaseModule,
    CryptoModule,
    RedisModule,
    HealthModule,
    GraphQLModule,
    KafkaModule,
    QueueModule,
    AppCqrsModule,
  ],
})
export class OrgCoreModule {}
