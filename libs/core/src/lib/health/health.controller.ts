import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckExecutor,
  HealthCheckResult,
} from './health-check.interface';

@Controller('health')
export class HealthController {
  constructor(private readonly executor: HealthCheckExecutor) {}

  @Get()
  async check(): Promise<HealthCheckResult> {
    return this.executor.execute();
  }

  @Get('live')
  liveness(): { status: string } {
    return { status: 'ok' };
  }

  @Get('ready')
  async readiness(): Promise<{ status: string }> {
    const result = await this.executor.execute();
    if (result.status === 'unhealthy') {
      throw new Error('Service is not ready');
    }
    return { status: 'ok' };
  }
}
