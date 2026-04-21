import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../../application/handlers/auth.service';
import {
  LoginDto,
  TokenResponseDto,
  AccountDto,
  SessionDto,
} from '../../application/dto';
import {
  LoginCommand,
  RefreshTokenCommand,
  RevokeSessionCommand,
} from '../../application/commands';
import {
  GetAccountByIdQuery,
  GetSessionsByAccountIdQuery,
  VerifyTokenQuery,
} from '../../application/queries';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ): Promise<TokenResponseDto> {
    const command = new LoginCommand({
      provider: dto.provider,
      providerId: dto.providerId,
      deviceInfo: req.headers['user-agent'] ?? 'unknown',
      ipAddress: req.ip ?? req.socket?.remoteAddress ?? undefined,
      userAgent: req.headers['user-agent'] ?? undefined,
    });

    const { tokens } = await this.authService.login(command);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt.toISOString(),
    };
  }

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<TokenResponseDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    const command = new RefreshTokenCommand(refreshToken);
    const tokens = await this.authService.refreshToken(command);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt.toISOString(),
    };
  }

  @Post('logout')
  async logout(
    @Body('sessionId') sessionId: string,
  ): Promise<{ success: boolean }> {
    const command = new RevokeSessionCommand(sessionId);
    await this.authService.revokeSession(command);
    return { success: true };
  }

  @Get('me')
  async me(@Headers('authorization') authHeader: string): Promise<AccountDto> {
    const token = this.extractToken(authHeader);
    if (!token) {
      throw new UnauthorizedException('Token required');
    }

    const query = new VerifyTokenQuery(token);
    const result = await this.authService.verifyToken(query);
    if (!result) {
      throw new UnauthorizedException('Invalid token');
    }

    const accountQuery = new GetAccountByIdQuery(result.accountId);
    const account = await this.authService.getAccount(accountQuery);
    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    return {
      id: account.id,
      userId: account.userId,
      status: account.status,
      isEmailVerified: account.isEmailVerified,
      lastLoginAt: account.lastLoginAt?.toISOString() ?? null,
    };
  }

  @Get('sessions')
  async sessions(
    @Headers('authorization') authHeader: string,
  ): Promise<SessionDto[]> {
    const token = this.extractToken(authHeader);
    if (!token) {
      throw new UnauthorizedException('Token required');
    }

    const query = new VerifyTokenQuery(token);
    const result = await this.authService.verifyToken(query);
    if (!result) {
      throw new UnauthorizedException('Invalid token');
    }

    const sessionsQuery = new GetSessionsByAccountIdQuery(result.accountId);
    const sessions = await this.authService.getSessions(sessionsQuery);

    return sessions.map((s) => ({
      id: s.id,
      deviceInfo: s.deviceInfo,
      ipAddress: s.ipAddress,
      status: s.status,
      expiresAt: s.expiresAt.toISOString(),
      createdAt: s.createdAt.toISOString(),
    }));
  }

  private extractToken(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.slice(7);
  }
}
