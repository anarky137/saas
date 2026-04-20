import { Session } from '../entities/session';

export interface ISessionRepository {
  findById(id: string): Promise<Session | null>;
  findByRefreshToken(token: string): Promise<Session | null>;
  findByAccountId(accountId: string): Promise<Session[]>;
  save(session: Session): Promise<Session>;
  delete(id: string): Promise<void>;
  deleteByAccountId(accountId: string): Promise<void>;
}

export interface SessionRepositoryPort extends ISessionRepository {}
