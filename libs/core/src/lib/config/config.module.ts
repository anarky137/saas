import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModuleOptions, CONFIG_MODULE_OPTIONS } from './config.interface';

@Module({})
export class ConfigModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    const envConfig: Record<string, unknown> = {
      NODE_ENV: process.env.NODE_ENV ?? 'development',
      APP_ENV: process.env.APP_ENV ?? 'development',
      APP_PORT: parseInt(process.env.APP_PORT ?? '3000'),
      APP_NAME: process.env.APP_NAME ?? 'saas',
      DATABASE_HOST: process.env.DATABASE_HOST ?? 'localhost',
      DATABASE_PORT: parseInt(process.env.DATABASE_PORT ?? '5432'),
      DATABASE_USER: process.env.DATABASE_USER ?? 'postgres',
      DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? 'postgres',
      DATABASE_NAME: process.env.DATABASE_NAME ?? 'saas',
      REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
      REDIS_PORT: parseInt(process.env.REDIS_PORT ?? '6379'),
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
      JWT_EXPIRATION: parseInt(process.env.JWT_EXPIRATION ?? '3600'),
      KAFKA_BROKER: process.env.KAFKA_BROKER ?? 'localhost:9092',
      ...options?.schema,
    };

    return {
      module: ConfigModule,
      global: options?.isGlobal ?? true,
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService(envConfig),
        },
        {
          provide: CONFIG_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [ConfigService],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useFactory: () => {
            const config = new ConfigService(
              process.env as Record<string, unknown>,
            );
            return config;
          },
        },
      ],
      exports: [ConfigService],
    };
  }
}
