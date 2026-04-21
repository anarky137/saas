import { Module } from '@nestjs/common';
import {
  ConfigModule,
  DatabaseModule,
  RedisModule,
  HealthModule,
  AppCqrsModule,
} from '@org/core';
import { UserModule } from '@org/user';
import { PORT, ENV, getRedisConfig } from '@org/shared';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppCqrsModule.forRoot(),
    RedisModule.forRoot(getRedisConfig('user:')),
    HealthModule.forRoot({
      enableMemory: true,
      enableRedis: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
