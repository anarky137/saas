export abstract class DomainEvent {
  abstract readonly type: string;
  readonly occurredAt: Date = new Date();
}

export class UserCreatedEvent extends DomainEvent {
  readonly type = 'user.created';

  constructor(
    readonly userId: string,
    readonly accountId: string,
    readonly email: string | null,
  ) {
    super();
  }
}

export class UserActivatedEvent extends DomainEvent {
  readonly type = 'user.activated';

  constructor(
    readonly userId: string,
    readonly accountId: string,
  ) {
    super();
  }
}

export type UserEvent = UserCreatedEvent | UserActivatedEvent;
