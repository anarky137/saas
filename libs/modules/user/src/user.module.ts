import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/handlers/user.service';
import { UserKafkaListener } from './presentation/listeners/user-kafka.listener';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserKafkaListener,
  ],
  exports: [UserService],
})
export class UserModule {}
