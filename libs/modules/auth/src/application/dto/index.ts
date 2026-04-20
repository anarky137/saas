export class LoginDto {
  provider!: 'email' | 'google' | 'github' | 'telegram';
  providerId!: string;
  email?: string;
  displayName?: string;
}

export class TokenResponseDto {
  accessToken!: string;
  refreshToken!: string;
  expiresAt!: string;
}

export class AccountDto {
  id!: string;
  userId!: string | null;
  status!: string;
  isEmailVerified!: boolean;
  lastLoginAt!: string | null;
}

export class SessionDto {
  id!: string;
  deviceInfo!: string;
  ipAddress!: string | null;
  status!: string;
  expiresAt!: string;
  createdAt!: string;
}
