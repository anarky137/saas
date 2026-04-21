export type SessionStatus = 'active' | 'revoked' | 'expired';

export interface SessionProps {
  id: string;
  accountId: string;
  refreshToken: string;
  accessToken?: string;
  deviceInfo: string;
  ipAddress: string | null;
  userAgent: string | null;
  status: SessionStatus;
  expiresAt: Date;
  revokedAt: Date | null;
  revokedReason: string | null;
  createdAt: Date;
}

export class Session {
  private readonly props: SessionProps;

  constructor(props: SessionProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  get deviceInfo(): string {
    return this.props.deviceInfo;
  }

  get ipAddress(): string | null {
    return this.props.ipAddress;
  }

  get userAgent(): string | null {
    return this.props.userAgent;
  }

  get status(): SessionStatus {
    return this.props.status;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get revokedAt(): Date | null {
    return this.props.revokedAt;
  }

  get revokedReason(): string | null {
    return this.props.revokedReason;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  isActive(): boolean {
    return this.props.status === 'active' && new Date() < this.props.expiresAt;
  }

  isExpired(): boolean {
    return new Date() >= this.props.expiresAt;
  }

  isRevoked(): boolean {
    return this.props.status === 'revoked';
  }

  revoke(reason?: string): void {
    if (this.props.status !== 'active') {
      throw new Error('Cannot revoke inactive session');
    }
    this.props.status = 'revoked';
    this.props.revokedAt = new Date();
    this.props.revokedReason = reason ?? null;
  }

  markExpired(): void {
    this.props.status = 'expired';
  }

  refresh(expiresAt: Date): void {
    if (!this.isActive()) {
      throw new Error('Cannot refresh expired or revoked session');
    }
    this.props.expiresAt = expiresAt;
  }
}
