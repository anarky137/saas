export abstract class DomainEvent {
  abstract readonly type: string;
  readonly occurredAt: Date = new Date();
}

export class UserRegisteredEvent extends DomainEvent {
  readonly type = 'user.registered';

  constructor(
    readonly accountId: string,
    readonly email: string | null,
  ) {
    super();
  }
}

export class UserLoggedInEvent extends DomainEvent {
  readonly type = 'user.logged_in';

  constructor(
    readonly accountId: string,
    readonly sessionId: string,
    readonly provider: string,
  ) {
    super();
  }
}

export class UserLoggedOutEvent extends DomainEvent {
  readonly type = 'user.logged_out';

  constructor(
    readonly accountId: string,
    readonly sessionId: string,
  ) {
    super();
  }
}

export class PasswordChangedEvent extends DomainEvent {
  readonly type = 'user.password_changed';

  constructor(readonly accountId: string) {
    super();
  }
}

export class AccountSuspendedEvent extends DomainEvent {
  readonly type = 'account.suspended';

  constructor(readonly accountId: string) {
    super();
  }
}

export class SessionRevokedEvent extends DomainEvent {
  readonly type = 'session.revoked';

  constructor(
    readonly accountId: string,
    readonly sessionId: string,
    readonly reason?: string,
  ) {
    super();
  }
}

export class AllSessionsRevokedEvent extends DomainEvent {
  readonly type = 'all_sessions.revoked';

  constructor(
    readonly accountId: string,
    readonly reason?: string,
  ) {
    super();
  }
}

export type AuthEvent =
  | UserRegisteredEvent
  | UserLoggedInEvent
  | UserLoggedOutEvent
  | PasswordChangedEvent
  | AccountSuspendedEvent
  | SessionRevokedEvent
  | AllSessionsRevokedEvent;
