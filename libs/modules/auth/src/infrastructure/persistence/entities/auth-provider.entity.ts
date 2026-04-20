import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountOrmEntity } from './account.entity';

@Entity('auth_providers')
export class AuthProviderOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => AccountOrmEntity, (account) => account.providers)
  account: AccountOrmEntity;

  @Column({ type: 'enum', enum: ['email', 'google', 'github', 'telegram'] })
  provider: 'email' | 'google' | 'github' | 'telegram';

  @Column()
  providerId: string;

  @Column({ nullable: true })
  email: string | null;

  @Column({ nullable: true })
  displayName: string | null;

  @Column({ nullable: true, type: 'text' })
  accessToken: string | null;

  @Column({ nullable: true, type: 'text' })
  refreshToken: string | null;

  @Column({ nullable: true, type: 'jsonb' })
  profileData: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
