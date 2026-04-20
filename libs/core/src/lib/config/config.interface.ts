export interface ConfigModuleOptions {
  envFilePath?: string;
  schema?: Record<string, unknown>;
  isGlobal?: boolean;
}

export const CONFIG_MODULE_OPTIONS = 'CONFIG_MODULE_OPTIONS';
