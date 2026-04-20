import { Injectable } from '@nestjs/common';
import {
  ENV,
  PORT,
  APP,
  SERVICE,
  getDatabaseConfig,
  getRedisConfig,
  getKafkaConfig,
  isProduction,
  isDevelopment,
  isTest,
} from '@org/shared';

@Injectable()
export class ConfigService {
  get env() {
    return ENV;
  }

  get port() {
    return PORT;
  }

  get app() {
    return APP;
  }

  get service() {
    return SERVICE;
  }

  getDatabaseConfig() {
    return getDatabaseConfig();
  }

  getRedisConfig() {
    return getRedisConfig();
  }

  getKafkaConfig(clientId?: string, groupId?: string) {
    return getKafkaConfig(clientId, groupId);
  }

  isProduction(): boolean {
    return isProduction();
  }

  isDevelopment(): boolean {
    return isDevelopment();
  }

  isTest(): boolean {
    return isTest();
  }
}
