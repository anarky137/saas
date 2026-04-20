import { Module, Optional } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { AuthService } from './application/handlers/auth.service.js';
import { AuthEventPublisher } from './infrastructure/messaging/event-publisher.js';
import type { AuthEventForwarder } from './infrastructure/messaging/event-forwarder.js';
import type { IKafkaProducer } from '@org/core';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthEventPublisher,
    {
      provide: AuthEventForwarder,
      inject: [IKafkaProducer],
      useFactory: (@Optional() kafkaProducer?: IKafkaProducer) => {
        return new AuthEventForwarder({} as never, kafkaProducer);
      },
    },
  ],
  exports: [AuthService, AuthEventPublisher],
})
export class AuthModule {}