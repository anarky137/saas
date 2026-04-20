import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { BaseEntity } from './entities/base.entity';

export interface DatabaseModuleOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  ssl?: boolean;
  synchronize?: boolean;
  logging?: boolean;
  entities?: Function[];
}

export interface DatabaseModuleAsyncOptions {
  useFactory: () => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
  imports?: Function[];
}

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: options.host ?? process.env.DATABASE_HOST ?? 'localhost',
          port: options.port ?? parseInt(process.env.DATABASE_PORT ?? '5432'),
          username: options.username ?? process.env.DATABASE_USER ?? 'postgres',
          password:
            options.password ?? process.env.DATABASE_PASSWORD ?? 'postgres',
          database: options.database ?? process.env.DATABASE_NAME ?? 'saas',
          ssl:
            (options.ssl ?? process.env.DATABASE_SSL === 'true')
              ? { rejectUnauthorized: false }
              : false,
          synchronize:
            options.synchronize ?? process.env.NODE_ENV !== 'production',
          logging: options.logging ?? process.env.NODE_ENV === 'development',
          entities: options.entities ?? [BaseEntity],
        } as DataSourceOptions),
      ],
      exports: [TypeOrmModule],
    };
  }

  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            const opts = await options.useFactory();
            return {
              type: 'postgres',
              host: opts.host ?? process.env.DATABASE_HOST ?? 'localhost',
              port: opts.port ?? parseInt(process.env.DATABASE_PORT ?? '5432'),
              username:
                opts.username ?? process.env.DATABASE_USER ?? 'postgres',
              password:
                opts.password ?? process.env.DATABASE_PASSWORD ?? 'postgres',
              database: opts.database ?? process.env.DATABASE_NAME ?? 'saas',
              ssl:
                (opts.ssl ?? process.env.DATABASE_SSL === 'true')
                  ? { rejectUnauthorized: false }
                  : false,
              synchronize:
                opts.synchronize ?? process.env.NODE_ENV !== 'production',
              logging: opts.logging ?? process.env.NODE_ENV === 'development',
              entities: opts.entities ?? [BaseEntity],
            } as DataSourceOptions;
          },
          imports: options.imports ?? [],
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}

export const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async (
      options?: DatabaseModuleOptions,
    ): Promise<DataSource> => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: options?.host ?? process.env.DATABASE_HOST ?? 'localhost',
        port: options?.port ?? parseInt(process.env.DATABASE_PORT ?? '5432'),
        username: options?.username ?? process.env.DATABASE_USER ?? 'postgres',
        password:
          options?.password ?? process.env.DATABASE_PASSWORD ?? 'postgres',
        database: options?.database ?? process.env.DATABASE_NAME ?? 'saas',
      });
      return dataSource.initialize();
    },
  },
];
