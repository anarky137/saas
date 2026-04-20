import { Session, SessionProps } from '../../../domain/entities/session';
import { SessionOrmEntity } from '../entities/session.entity';

export class SessionMapper {
  static toDomain(entity: SessionOrmEntity): Session {
    const props: SessionProps = {
      id: entity.id,
      accountId: entity.accountId,
      refreshToken: entity.refreshToken,
      deviceInfo: entity.deviceInfo,
      ipAddress: entity.ipAddress,
      userAgent: entity.userAgent,
      status: entity.status,
      expiresAt: entity.expiresAt,
      revokedAt: entity.revokedAt,
      revokedReason: entity.revokedReason,
      createdAt: entity.createdAt,
    };
    return new Session(props);
  }

  static toOrm(domain: Session): SessionOrmEntity {
    const entity = new SessionOrmEntity();
    entity.id = domain.id;
    entity.accountId = domain.accountId;
    entity.refreshToken = domain.refreshToken;
    entity.deviceInfo = domain.deviceInfo;
    entity.ipAddress = domain.ipAddress;
    entity.userAgent = domain.userAgent;
    entity.status = domain.status;
    entity.expiresAt = domain.expiresAt;
    entity.revokedAt = domain.revokedAt;
    entity.revokedReason = domain.revokedReason;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}
