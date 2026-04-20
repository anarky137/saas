import { plainToClass, ClassConstructor } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validateConfig<T>(
  configClass: ClassConstructor<T>,
  config: Record<string, unknown>,
): T {
  const validatedConfig = plainToClass(configClass, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
