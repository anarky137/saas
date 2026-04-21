export interface UserProps {
  id: string;
  accountId: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  status: 'pending' | 'active' | 'suspended' | 'deleted';
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get email(): string | null {
    return this.props.email;
  }

  get displayName(): string | null {
    return this.props.displayName;
  }

  get status(): UserProps['status'] {
    return this.props.status;
  }

  activate(): void {
    this.props.status = 'active';
    this.props.emailVerifiedAt = new Date();
  }

  suspend(): void {
    this.props.status = 'suspended';
  }
}
