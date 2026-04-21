import { Module } from '@nestjs/common';
import {
  ConfigModule,
  RedisModule,
  HealthModule,
  AppCqrsModule,
} from '@org/core';
import { NotificationModule } from '@org/notification';
import { getRedisConfig } from '@org/shared';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppCqrsModule.forRoot(),
    RedisModule.forRoot(getRedisConfig('notification:')),
    HealthModule.forRoot({
      enableMemory: true,
    }),
    NotificationModule,
  ],
})
export class AppModule {}
