import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../domain/ports/tokens';
import type { CreateUserFromAccountCommand } from '../commands/create-user.command';
import type { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { Inject } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}

  async createUserFromAccount(cmd: CreateUserFromAccountCommand): Promise<User> {
    const existing = await this.userRepo.findByAccountId(cmd.accountId);
    if (existing) {
      return existing;
    }

    const now = new Date();
    const userProps = {
      id: crypto.randomUUID(),
      accountId: cmd.accountId,
      email: cmd.email,
      displayName: cmd.email?.split('@')[0] ?? null,
      avatarUrl: null,
      status: 'pending' as const,
      emailVerifiedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const user = new User(userProps);
    return this.userRepo.save(user);
  }

  async getUserById(query: GetUserByIdQuery): Promise<User | null> {
    return this.userRepo.findById(query.id);
  }

  async activateUser(userId: string): Promise<User | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return null;
    }
    user.activate();
    return this.userRepo.save(user);
  }
}
