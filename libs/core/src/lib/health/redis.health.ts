import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { HealthCheck, HealthCheckResponse } from './health-check.interface';

@Injectable()
export class RedisHealthCheck extends HealthCheck {
  constructor(private readonly redis: RedisService) {
    super();
  }

  readonly name = 'redis';

  protected async performCheck(): Promise<Partial<HealthCheckResponse>> {
    const start = Date.now();
    await this.redis.ping();
    return { latency: Date.now() - start };
  }
}
