import { AuthProvider, AuthProviderType } from '../entities/auth-provider';

export interface IAuthProviderRepository {
  findById(id: string): Promise<AuthProvider | null>;
  findByAccountId(accountId: string): Promise<AuthProvider[]>;
  findByProviderAndProviderId(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<AuthProvider | null>;
  findByEmail(email: string): Promise<AuthProvider | null>;
  save(provider: AuthProvider): Promise<AuthProvider>;
  delete(id: string): Promise<void>;
}

export interface AuthProviderRepositoryPort extends IAuthProviderRepository {}
