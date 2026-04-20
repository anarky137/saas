export type AccountStatus = 'active' | 'suspended' | 'deactivated';

export interface AccountProps {
  id: string;
  userId: string | null;
  status: AccountStatus;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Account {
  private readonly props: AccountProps;

  constructor(props: AccountProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string | null {
    return this.props.userId;
  }

  get status(): AccountStatus {
    return this.props.status;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get lastLoginAt(): Date | null {
    return this.props.lastLoginAt;
  }

  get lastLoginIp(): string | null {
    return this.props.lastLoginIp;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isActive(): boolean {
    return this.props.status === 'active';
  }

  isSuspended(): boolean {
    return this.props.status === 'suspended';
  }

  suspend(): void {
    if (this.props.status !== 'active') {
      throw new Error('Cannot suspend account that is not active');
    }
    this.props.status = 'suspended';
  }

  activate(): void {
    if (this.props.status !== 'suspended') {
      throw new Error('Can only activate suspended accounts');
    }
    this.props.status = 'active';
  }

  deactivate(): void {
    this.props.status = 'deactivated';
  }

  verifyEmail(): void {
    this.props.isEmailVerified = true;
  }

  linkUser(userId: string): void {
    if (this.props.userId !== null) {
      throw new Error('Account is already linked to a user');
    }
    this.props.userId = userId;
  }

  unlinkUser(): void {
    this.props.userId = null;
  }

  recordLogin(ip: string): void {
    this.props.lastLoginAt = new Date();
    this.props.lastLoginIp = ip;
  }
}
