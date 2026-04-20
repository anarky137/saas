import { z } from 'zod';

export const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development'),
  APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  APP_NAME: z.string().default('saas'),
  APP_PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
});

export type BaseEnvConfig = z.infer<typeof baseEnvSchema>;

export interface ConfigModuleOptions {
  envFilePath?: string;
  schema?: z.ZodType;
  isGlobal?: boolean;
}
