import { Module } from '@nestjs/common';
import { NotificationService } from './application/handlers/notification.service';
import { UserEventListener } from './presentation/listeners/user-event.listener';

@Module({
  providers: [
    NotificationService,
    UserEventListener,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
