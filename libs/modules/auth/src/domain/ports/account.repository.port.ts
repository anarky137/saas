import { Account, AccountProps } from '../entities/account';

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account | null>;
  save(account: Account): Promise<Account>;
  delete(id: string): Promise<void>;
}

export interface AccountRepositoryPort extends IAccountRepository {}
