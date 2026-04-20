export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface ITokenService {
  generateAccessToken(
    payload: Record<string, unknown>,
    expiresIn: number,
  ): string;
  generateRefreshToken(): string;
  generateTokenPair(
    payload: Record<string, unknown>,
    accessExpiresIn: number,
    refreshExpiresIn: number,
  ): TokenPair;
  verifyAccessToken(token: string, secret: string): Record<string, unknown>;
  verifyRefreshToken(token: string, secret: string): Record<string, unknown>;
}

export interface TokenServicePort extends ITokenService {}
