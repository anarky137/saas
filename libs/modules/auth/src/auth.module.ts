import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { AuthService } from './application/handlers/auth.service.js';
import { AuthEventsModule } from './auth.events.module.js';

@Module({
  imports: [forwardRef(() => AuthEventsModule)],
  controllers: [AuthController],
  providers: [AuthService, AuthEventsModule],
  exports: [AuthService, AuthEventsModule],
})
export class AuthModule {}
