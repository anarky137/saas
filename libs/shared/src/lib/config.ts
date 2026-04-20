export function getEnvValue(key: string, fallback: string): string {
  return process.env[key] !== undefined ? process.env[key]! : fallback;
}

export function getEnvNum(key: string, fallback: number): number {
  const val = process.env[key];
  return val !== undefined ? Number(val) : fallback;
}

export function getEnvBool(key: string, fallback: boolean): boolean {
  const val = process.env[key];
  return val !== undefined ? val === 'true' : fallback;
}

export function getEnvArray(key: string, fallback: string[]): string[] {
  const val = process.env[key];
  return val ? val.split(',') : fallback;
}

export const VERSION = {
  MAJOR: 1,
  MINOR: 0,
  PATCH: 0,
  FULL: '1.0.0',
  FULL_V1: 'v1',
} as const;

export const API_VERSION = {
  CURRENT: 'v1',
  V1: 'v1',
  V2: 'v2',
} as const;

export const PORT = {
  GATEWAY: getEnvNum('PORT_GATEWAY', 3000),
  AUTH: getEnvNum('PORT_AUTH', 3001),
  USER: getEnvNum('PORT_USER', 3002),
  NOTIFICATION: getEnvNum('PORT_NOTIFICATION', 3003),
  GRPC_AUTH: getEnvNum('PORT_GRPC_AUTH', 50051),
  GRPC_USER: getEnvNum('PORT_GRPC_USER', 50052),
  GRPC_NOTIFICATION: getEnvNum('PORT_GRPC_NOTIFICATION', 50053),
  REDIS: getEnvNum('PORT_REDIS', 6379),
  KAFKA: getEnvNum('PORT_KAFKA', 9092),
} as const;

export const SERVICE = {
  GATEWAY: 'api-gateway',
  AUTH: 'auth-service',
  USER: 'user-service',
  NOTIFICATION: 'notification-service',
} as const;

export const DEFAULT_TIMEOUT = 30000;
export const DEFAULT_RETRY_ATTEMPTS = 3;
export const DEFAULT_RETRY_DELAY = 1000;

export const ENV = {
  NODE_ENV: getEnvValue('NODE_ENV', 'development'),
  APP_ENV: getEnvValue('APP_ENV', 'development'),

  DATABASE_HOST: getEnvValue('DATABASE_HOST', 'localhost'),
  DATABASE_PORT: getEnvNum('DATABASE_PORT', 5432),
  DATABASE_USER: getEnvValue('DATABASE_USER', 'postgres'),
  DATABASE_PASSWORD: getEnvValue('DATABASE_PASSWORD', 'postgres'),
  DATABASE_NAME: getEnvValue('DATABASE_NAME', 'saas'),
  DATABASE_URL: getEnvValue('DATABASE_URL', ''),

  REDIS_HOST: getEnvValue('REDIS_HOST', 'localhost'),
  REDIS_PORT: getEnvNum('REDIS_PORT', 6379),
  REDIS_PASSWORD: getEnvValue('REDIS_PASSWORD', ''),
  REDIS_DB: getEnvNum('REDIS_DB', 0),

  JWT_SECRET: getEnvValue('JWT_SECRET', 'change-me-in-production'),
  JWT_EXPIRES: getEnvValue('JWT_EXPIRES', '15m'),
  JWT_REFRESH_EXPIRES: getEnvValue('JWT_REFRESH_EXPIRES', '7d'),
  JWT_ALGORITHM: getEnvValue('JWT_ALGORITHM', 'HS256'),

  KAFKA_BROKERS: getEnvArray('KAFKA_BROKERS', ['localhost:9092']),
  KAFKA_CLIENT_ID: getEnvValue('KAFKA_CLIENT_ID', 'saas-app'),
  KAFKA_GROUP_ID: getEnvValue('KAFKA_GROUP_ID', 'saas-group'),
  KAFKA_CONSUMER_SESSION_TIMEOUT: getEnvNum(
    'KAFKA_CONSUMER_SESSION_TIMEOUT',
    30000,
  ),
  KAFKA_CONSUMER_HEARTBEAT_INTERVAL: getEnvNum(
    'KAFKA_CONSUMER_HEARTBEAT_INTERVAL',
    3000,
  ),

  GRPC_PROTO_PATH: getEnvValue('GRPC_PROTO_PATH', ''),
  GRAPHQL_PATH: getEnvValue('GRAPHQL_PATH', '/graphql'),
  REST_PATH: getEnvValue('REST_PATH', 'api'),

  CORS_ORIGIN: getEnvValue('CORS_ORIGIN', 'http://localhost:4200'),
  CORS_CREDENTIALS: getEnvBool('CORS_CREDENTIALS', true),

  SENDGRID_API_KEY: getEnvValue('SENDGRID_API_KEY', ''),
  SENDGRID_FROM_EMAIL: getEnvValue(
    'SENDGRID_FROM_EMAIL',
    'noreply@example.com',
  ),
  SENDGRID_FROM_NAME: getEnvValue('SENDGRID_FROM_NAME', 'SaaS App'),

  TWILIO_ACCOUNT_SID: getEnvValue('TWILIO_ACCOUNT_SID', ''),
  TWILIO_AUTH_TOKEN: getEnvValue('TWILIO_AUTH_TOKEN', ''),
  TWILIO_FROM_NUMBER: getEnvValue('TWILIO_FROM_NUMBER', ''),

  LOG_LEVEL: getEnvValue('LOG_LEVEL', 'info'),

  HEALTH_CHECK_INTERVAL: getEnvNum('HEALTH_CHECK_INTERVAL', 30000),
} as const;

export const APP = {
  NAME: getEnvValue('APP_NAME', 'saas'),
  VERSION: VERSION.FULL,
  VERSION_V1: VERSION.FULL_V1,
  API_URL: `http://localhost:${PORT.GATEWAY}/${ENV.REST_PATH}`,
  CORS_ORIGIN: ENV.CORS_ORIGIN,
} as const;

export const GRPC = {
  AUTH_PACKAGE: 'auth',
  AUTH_PROTO: ENV.GRPC_PROTO_PATH ? `${ENV.GRPC_PROTO_PATH}/auth.proto` : '',
  AUTH_URL: `localhost:${PORT.GRPC_AUTH}`,
  USER_PACKAGE: 'user',
  USER_PROTO: ENV.GRPC_PROTO_PATH ? `${ENV.GRPC_PROTO_PATH}/user.proto` : '',
  USER_URL: `localhost:${PORT.GRPC_USER}`,
  NOTIFICATION_PACKAGE: 'notification',
  NOTIFICATION_PROTO: ENV.GRPC_PROTO_PATH
    ? `${ENV.GRPC_PROTO_PATH}/notification.proto`
    : '',
  NOTIFICATION_URL: `localhost:${PORT.GRPC_NOTIFICATION}`,
} as const;

export const getServiceConfig = (serviceName: keyof typeof SERVICE) => ({
  name: SERVICE[serviceName],
  port: PORT[`${serviceName.toUpperCase()}` as keyof typeof PORT] as number,
  grpcPort: PORT[
    `GRPC_${serviceName.toUpperCase()}` as keyof typeof PORT
  ] as number,
});

export const getDatabaseConfig = () => ({
  host: ENV.DATABASE_HOST,
  port: ENV.DATABASE_PORT,
  username: ENV.DATABASE_USER,
  password: ENV.DATABASE_PASSWORD,
  database: ENV.DATABASE_NAME,
  url: ENV.DATABASE_URL,
});

export const getRedisConfig = () => ({
  host: ENV.REDIS_HOST,
  port: ENV.REDIS_PORT,
  password: ENV.REDIS_PASSWORD,
  db: ENV.REDIS_DB,
});

export const getKafkaConfig = (clientId?: string, groupId?: string) => ({
  brokers: ENV.KAFKA_BROKERS,
  clientId: clientId ?? ENV.KAFKA_CLIENT_ID,
  groupId: groupId ?? ENV.KAFKA_GROUP_ID,
});

export const isProduction = () => ENV.NODE_ENV === 'production';
export const isDevelopment = () => ENV.NODE_ENV === 'development';
export const isTest = () => ENV.NODE_ENV === 'test';
