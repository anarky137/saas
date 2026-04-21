import { InjectionToken } from '@nestjs/common';

export const NOTIFICATION_REPOSITORY = Symbol.for('NotificationRepository') as InjectionToken;
export const NOTIFICATION_EVENT_PUBLISHER = Symbol.for('NotificationEventPublisher') as InjectionToken;
