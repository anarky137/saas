export interface HttpModuleOptions {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export const HTTP_MODULE_OPTIONS = 'HTTP_MODULE_OPTIONS';
