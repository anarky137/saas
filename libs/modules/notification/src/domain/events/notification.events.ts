export abstract class DomainEvent {
  abstract readonly type: string;
  readonly occurredAt: Date = new Date();
}

export class NotificationSentEvent extends DomainEvent {
  readonly type = 'notification.sent';
  constructor(
    readonly notificationId: string,
    readonly userId: string,
  ) { super(); }
}

export class NotificationFailedEvent extends DomainEvent {
  readonly type = 'notification.failed';
  constructor(
    readonly notificationId: string,
    readonly userId: string,
    readonly error: string,
  ) { super(); }
}

export type NotificationEvent = NotificationSentEvent | NotificationFailedEvent;
