import { Injectable } from '@nestjs/common';
import { Account } from '../../domain/entities/account.js';
import type { AuthProviderProps } from '../../domain/entities/auth-provider.js';
import { Session, SessionProps } from '../../domain/entities/session.js';
import type {
  AccountRepositoryPort,
  SessionRepositoryPort,
  TokenServicePort,
  TokenPair,
} from '../../domain/ports/index.js';
import {
  CreateAccountCommand,
  LoginCommand,
  RefreshTokenCommand,
  RevokeSessionCommand,
  RevokeAllSessionsCommand,
} from '../commands/index.js';
import {
  GetAccountByIdQuery,
  GetSessionsByAccountIdQuery,
  VerifyTokenQuery,
} from '../queries/index.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountRepo: AccountRepositoryPort,
    private readonly sessionRepo: SessionRepositoryPort,
    private readonly tokenService: TokenServicePort,
  ) {}

  async createAccount(
    cmd: CreateAccountCommand,
  ): Promise<{ account: Account; tokens: TokenPair }> {
    let account: Account;

    const existingProvider = null;

    if (existingProvider) {
      account = await this.accountRepo.findById(existingProvider.accountId);
      if (!account) {
        throw new Error('Account not found for existing provider');
      }
    } else {
      const now = new Date();
      const accountProps = {
        id: crypto.randomUUID(),
        userId: cmd.userId,
        status: 'active' as const,
        isEmailVerified: cmd.provider === 'email',
        lastLoginAt: null,
        lastLoginIp: null,
        createdAt: now,
        updatedAt: now,
      };
      account = new Account(accountProps);
      account = await this.accountRepo.save(account);

      const providerProps: AuthProviderProps = {
        id: crypto.randomUUID(),
        accountId: account.id,
        provider: cmd.provider,
        providerId: cmd.providerId,
        email: cmd.email,
        displayName: cmd.displayName,
        profileData: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };
    }

    const tokens = this.tokenService.generateTokenPair(
      { sub: account.id, type: 'access' },
      3600,
      604800,
    );

    const expiresAt = new Date(Date.now() + 604800 * 1000);
    const sessionProps: SessionProps = {
      id: crypto.randomUUID(),
      accountId: account.id,
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      deviceInfo: 'unknown',
      ipAddress: null,
      userAgent: null,
      status: 'active' as const,
      expiresAt,
      revokedAt: null,
      revokedReason: null,
      createdAt: new Date(),
    };
    const session = new Session(sessionProps);
    await this.sessionRepo.save(session);

    return { account, tokens };
  }

  async login(
    cmd: LoginCommand,
  ): Promise<{ account: Account; tokens: TokenPair }> {
    const provider = null;

    if (!provider) {
      throw new Error('Invalid credentials');
    }

    const account = await this.accountRepo.findById(provider.accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    if (!account.isActive()) {
      throw new Error('Account is not active');
    }

    const tokens = this.tokenService.generateTokenPair(
      { sub: account.id, type: 'access' },
      3600,
      604800,
    );

    const expiresAt = new Date(Date.now() + 604800 * 1000);
    const sessionProps: SessionProps = {
      id: crypto.randomUUID(),
      accountId: account.id,
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      deviceInfo: cmd.deviceInfo,
      ipAddress: cmd.ipAddress,
      userAgent: cmd.userAgent,
      status: 'active' as const,
      expiresAt,
      revokedAt: null,
      revokedReason: null,
      createdAt: new Date(),
    };
    const session = new Session(sessionProps);
    await this.sessionRepo.save(session);

    account.recordLogin(cmd.ipAddress ?? 'unknown');
    await this.accountRepo.save(account);

    return { account, tokens };
  }

  async refreshToken(cmd: RefreshTokenCommand): Promise<TokenPair> {
    const session = await this.sessionRepo.findByRefreshToken(cmd.refreshToken);
    if (!session) {
      throw new Error('Invalid refresh token');
    }

    if (!session.isActive()) {
      throw new Error('Session is not active');
    }

    const account = await this.accountRepo.findById(session.accountId);
    if (!account || !account.isActive()) {
      throw new Error('Account not found or inactive');
    }

    const tokens = this.tokenService.generateTokenPair(
      { sub: account.id, type: 'access' },
      3600,
      604800,
    );

    const expiresAt = new Date(Date.now() + 604800 * 1000);
    session.refresh(expiresAt);
    await this.sessionRepo.save(session);

    return tokens;
  }

  async revokeSession(cmd: RevokeSessionCommand): Promise<void> {
    const session = await this.sessionRepo.findById(cmd.sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.revoke(cmd.reason);
    await this.sessionRepo.save(session);
  }

  async revokeAllSessions(cmd: RevokeAllSessionsCommand): Promise<void> {
    const sessions = await this.sessionRepo.findByAccountId(cmd.accountId);
    for (const session of sessions) {
      if (session.isActive()) {
        session.revoke(cmd.reason);
        await this.sessionRepo.save(session);
      }
    }
  }

  async getAccount(query: GetAccountByIdQuery): Promise<Account | null> {
    return this.accountRepo.findById(query.id);
  }

  async getSessions(query: GetSessionsByAccountIdQuery): Promise<Session[]> {
    return this.sessionRepo.findByAccountId(query.accountId);
  }

  async verifyToken(
    query: VerifyTokenQuery,
  ): Promise<{ accountId: string } | null> {
    try {
      const payload = this.tokenService.verifyAccessToken(
        query.token,
        process.env.JWT_SECRET ?? 'secret',
      );
      if (payload.type !== 'access') {
        return null;
      }
      return { accountId: payload.sub as string };
    } catch {
      return null;
    }
  }
}
