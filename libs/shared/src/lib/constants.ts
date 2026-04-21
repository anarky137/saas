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
  REDIS: 6379,
  KAFKA: 9092,
  POSTGRES: 5432,
} as const;

export const REDIS_KEYS = {
  SESSION: (userId: string) => `session:${userId}`,
  RATE_LIMIT: (key: string) => `rate-limit:${key}`,
  CACHE: (key: string) => `cache:${key}`,
} as const;

export const DEFAULT_KAFKA_BROKERS = ['localhost:9092'] as const;

export const RETRY = {
  DELAY_MS: 1000,
  MAX_DELAY_MS: 10000,
  ATTEMPTS: 3,
  INITIAL_DELAY_MS: 1000,
} as const;
