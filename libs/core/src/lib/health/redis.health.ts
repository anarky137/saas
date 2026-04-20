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
    const client = await this.getClient();
    const start = Date.now();
    await client.ping();
    const latency = Date.now() - start;

    return { latency };
  }

  private async getClient() {
    return this.redis.getClient('health');
  }
}
