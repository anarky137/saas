import { Injectable, Inject } from '@nestjs/common';
import { CONFIG_MODULE_OPTIONS } from './config.interface';

@Injectable()
export class ConfigService {
  private config: Record<string, unknown>;

  constructor(
    @Inject(CONFIG_MODULE_OPTIONS)
    config: Record<string, unknown>,
  ) {
    this.config = config;
  }

  get<T = unknown>(key: string): T {
    return this.config[key] as T;
  }

  getOrThrow<T = unknown>(key: string): T {
    const value = this.config[key];
    if (value === undefined) {
      throw new Error(`Config key "${key}" is not defined`);
    }
    return value as T;
  }

  getString(key: string, defaultValue?: string): string {
    const value = this.config[key];
    return typeof value === 'string' ? value : (defaultValue ?? '');
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = this.config[key];
    return typeof value === 'number' ? value : (defaultValue ?? 0);
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.config[key];
    return typeof value === 'boolean' ? value : (defaultValue ?? false);
  }
}
