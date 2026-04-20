export type AuthProviderType = 'email' | 'google' | 'github' | 'telegram';

export interface AuthProviderProps {
  id: string;
  accountId: string;
  provider: AuthProviderType;
  providerId: string;
  email: string | null;
  displayName: string | null;
  profileData: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthProvider {
  private readonly props: AuthProviderProps;

  constructor(props: AuthProviderProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get provider(): AuthProviderType {
    return this.props.provider;
  }

  get providerId(): string {
    return this.props.providerId;
  }

  get email(): string | null {
    return this.props.email;
  }

  get displayName(): string | null {
    return this.props.displayName;
  }

  get profileData(): Record<string, unknown> | null {
    return this.props.profileData;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isEmailProvider(): boolean {
    return this.props.provider === 'email';
  }

  isOAuthProvider(): boolean {
    return ['google', 'github', 'telegram'].includes(this.props.provider);
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  activate(): void {
    this.props.isActive = true;
  }

  updateProfile(profileData: Record<string, unknown>): void {
    this.props.profileData = profileData;
  }
}
