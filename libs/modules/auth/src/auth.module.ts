import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { AuthService } from './application/handlers/auth.service.js';
import { AuthEventPublisher } from './infrastructure/messaging/event-publisher.js';
import { AuthEventForwarder } from './infrastructure/messaging/event-forwarder.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthEventPublisher, AuthEventForwarder],
  exports: [AuthService, AuthEventPublisher],
})
export class AuthModule {}
