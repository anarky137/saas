import { Account, AccountProps } from '../../../domain/entities/account';
import { AccountOrmEntity } from '../entities/account.entity';

export class AccountMapper {
  static toDomain(entity: AccountOrmEntity): Account {
    const props: AccountProps = {
      id: entity.id,
      userId: entity.userId,
      status: entity.status,
      isEmailVerified: entity.isEmailVerified,
      lastLoginAt: entity.lastLoginAt,
      lastLoginIp: entity.lastLoginIp,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
    return new Account(props);
  }

  static toOrm(domain: Account): AccountOrmEntity {
    const entity = new AccountOrmEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.status = domain.status;
    entity.isEmailVerified = domain.isEmailVerified;
    entity.lastLoginAt = domain.lastLoginAt;
    entity.lastLoginIp = domain.lastLoginIp;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
