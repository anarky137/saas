import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { IsEnv, IsNodeEnv } from './env.decorators';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  ValidateIf,
  Max,
  Min,
} from 'class-validator';
import { IsUppercase, MinLength, Matches } from 'class-validator';

class EnvironmentVariables {
  @IsNodeEnv()
  NODE_ENV: 'development' | 'production' | 'test';

  @IsEnv()
  APP_ENV: 'development' | 'staging' | 'production';

  @IsNumber()
  @IsOptional()
  @Min(1000)
  @Max(65535)
  APP_PORT?: number;

  @IsString()
  APP_NAME: string;

  @IsString()
  @IsOptional()
  APP_URL?: string;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL?: boolean;

  @IsString()
  @Matches(/^postgres:\/\/.*/)
  @IsOptional()
  DATABASE_URL?: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  REDIS_PORT: number;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(65535)
  REDIS_DB?: number;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  JWT_EXPIRATION: number;

  @IsNumber()
  @IsOptional()
  JWT_REFRESH_EXPIRATION?: number;

  @IsString()
  KAFKA_BROKER: string;

  @IsNumber()
  @IsOptional()
  KAFKA_CLIENT_ID?: number;
}

export function validate(
  config: Record<string, unknown>,
  options?: { whitelist?: boolean; forbidNonWhitelisted?: boolean },
) {
  const cfg = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(cfg, {
    whitelist: options?.whitelist ?? true,
    forbidNonWhitelisted: options?.forbidNonWhitelisted ?? true,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return cfg;
}

export { EnvironmentVariables };
