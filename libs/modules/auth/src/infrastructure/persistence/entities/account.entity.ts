import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { AuthProviderOrmEntity } from './auth-provider.entity';
import { SessionOrmEntity } from './session.entity';

@Entity('accounts')
export class AccountOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string | null;

  @Column({
    type: 'enum',
    enum: ['active', 'suspended', 'deactivated'],
    default: 'active',
  })
  status: 'active' | 'suspended' | 'deactivated';

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date | null;

  @Column({ nullable: true })
  lastLoginIp: string | null;

  @OneToMany(() => AuthProviderOrmEntity, (provider) => provider.account)
  providers: AuthProviderOrmEntity[];

  @OneToMany(() => SessionOrmEntity, (session) => session.account)
  sessions: SessionOrmEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
