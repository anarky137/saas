import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { AccountOrmEntity } from './account.entity';

@Entity('sessions')
@Index(['accountId', 'status'])
@Index(['refreshToken'])
export class SessionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  accountId!: string;

  @ManyToOne(() => AccountOrmEntity, (account) => account.sessions)
  account!: AccountOrmEntity;

  @Column({ unique: true })
  refreshToken!: string;

  @Column({ nullable: true })
  accessToken!: string | null;

  @Column()
  deviceInfo!: string;

  @Column({ nullable: true })
  ipAddress!: string | null;

  @Column({ nullable: true })
  userAgent!: string | null;

  @Column({
    type: 'enum',
    enum: ['active', 'revoked', 'expired'],
    default: 'active',
  })
  status!: 'active' | 'revoked' | 'expired';

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ nullable: true })
  revokedAt!: Date | null;

  @Column({ nullable: true })
  revokedReason!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
