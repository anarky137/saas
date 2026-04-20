export const SERVICE_NAMES = {
  API_GATEWAY: 'api-gateway',
  AUTH_SERVICE: 'auth-service',
  USER_SERVICE: 'user-service',
  NOTIFICATION_SERVICE: 'notification-service',
} as const;

export const DEFAULT_PORTS = {
  GATEWAY: 3000,
  AUTH: 3001,
  USER: 3002,
  NOTIFICATION: 3003,
  GRPC_AUTH: 50051,
  GRPC_USER: 50052,
  GRPC_NOTIFICATION: 50053,
} as const;

export const REDIS_KEYS = {
  SESSION: (userId: string) => `session:${userId}`,
  RATE_LIMIT: (key: string) => `rate-limit:${key}`,
  CACHE: (key: string) => `cache:${key}`,
} as const;
