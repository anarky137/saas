export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export class AccountCreatedEvent implements DomainEvent {
  readonly eventName = 'AccountCreatedEvent';
  readonly occurredAt: Date;

  constructor(
    public readonly accountId: string,
    public readonly userId: string | null,
  ) {
    this.occurredAt = new Date();
  }
}

export class AccountLoginEvent implements DomainEvent {
  readonly eventName = 'AccountLoginEvent';
  readonly occurredAt: Date;

  constructor(
    public readonly accountId: string,
    public readonly ipAddress: string,
    public readonly provider: string,
  ) {
    this.occurredAt = new Date();
  }
}

export class SessionCreatedEvent implements DomainEvent {
  readonly eventName = 'SessionCreatedEvent';
  readonly occurredAt: Date;

  constructor(
    public readonly sessionId: string,
    public readonly accountId: string,
  ) {
    this.occurredAt = new Date();
  }
}

export class SessionRevokedEvent implements DomainEvent {
  readonly eventName = 'SessionRevokedEvent';
  readonly occurredAt: Date;

  constructor(
    public readonly sessionId: string,
    public readonly accountId: string,
    public readonly reason: string | null,
  ) {
    this.occurredAt = new Date();
  }
}

export class AccountSuspendedEvent implements DomainEvent {
  readonly eventName = 'AccountSuspendedEvent';
  readonly occurredAt: Date;

  constructor(public readonly accountId: string) {
    this.occurredAt = new Date();
  }
}
