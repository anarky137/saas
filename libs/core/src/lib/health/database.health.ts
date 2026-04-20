import { Injectable } from '@nestjs/common';
import { HealthCheck, HealthCheckResponse } from './health-check.interface';

@Injectable()
export class DatabaseHealthCheck extends HealthCheck {
  readonly name = 'database';

  protected async performCheck(): Promise<Partial<HealthCheckResponse>> {
    return { metadata: { version: 'unknown' } };
  }
}
