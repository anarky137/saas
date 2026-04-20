import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { AuthService } from './application/handlers/auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
