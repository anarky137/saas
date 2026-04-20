export class CreateAccountCommand {
  readonly id: string;
  readonly userId: string | null;
  readonly provider: 'email' | 'google' | 'github' | 'telegram';
  readonly providerId: string;
  readonly email: string | null;
  readonly displayName: string | null;

  constructor(data: {
    userId?: string;
    provider: 'email' | 'google' | 'github' | 'telegram';
    providerId: string;
    email?: string;
    displayName?: string;
  }) {
    this.id = crypto.randomUUID();
    this.userId = data.userId ?? null;
    this.provider = data.provider;
    this.providerId = data.providerId;
    this.email = data.email ?? null;
    this.displayName = data.displayName ?? null;
  }
}

export class LoginCommand {
  readonly id: string;
  readonly provider: 'email' | 'google' | 'github' | 'telegram';
  readonly providerId: string;
  readonly deviceInfo: string;
  readonly ipAddress: string | null;
  readonly userAgent: string | null;

  constructor(data: {
    provider: 'email' | 'google' | 'github' | 'telegram';
    providerId: string;
    deviceInfo: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    this.id = crypto.randomUUID();
    this.provider = data.provider;
    this.providerId = data.providerId;
    this.deviceInfo = data.deviceInfo;
    this.ipAddress = data.ipAddress ?? null;
    this.userAgent = data.userAgent ?? null;
  }
}

export class RefreshTokenCommand {
  readonly id: string;
  readonly refreshToken: string;

  constructor(refreshToken: string) {
    this.id = crypto.randomUUID();
    this.refreshToken = refreshToken;
  }
}

export class RevokeSessionCommand {
  readonly id: string;
  readonly sessionId: string;
  readonly reason: string | null;

  constructor(sessionId: string, reason?: string) {
    this.id = crypto.randomUUID();
    this.sessionId = sessionId;
    this.reason = reason ?? null;
  }
}

export class RevokeAllSessionsCommand {
  readonly id: string;
  readonly accountId: string;
  readonly reason: string | null;

  constructor(accountId: string, reason?: string) {
    this.id = crypto.randomUUID();
    this.accountId = accountId;
    this.reason = reason ?? null;
  }
}
