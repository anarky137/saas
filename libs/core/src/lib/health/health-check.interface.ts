import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: Record<string, HealthCheckResponse>;
  metadata?: Record<string, unknown>;
}

export interface HealthCheckResponse {
  status: 'up' | 'down';
  latency?: number;
  message?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export abstract class HealthCheck {
  abstract readonly name: string;

  async check(): Promise<HealthCheckResponse> {
    try {
      const start = Date.now();
      const result = await this.performCheck();
      return {
        status: 'up',
        latency: Date.now() - start,
        ...result,
      };
    } catch (error) {
      return {
        status: 'down',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  protected abstract performCheck(): Promise<Partial<HealthCheckResponse>>;
}

export class HealthCheckExecutor {
  private readonly checks: Map<string, HealthCheck> = new Map();

  register(check: HealthCheck): void {
    this.checks.set(check.name, check);
  }

  async execute(): Promise<HealthCheckResult> {
    const results: Record<string, HealthCheckResponse> = {};
    let hasDown = false;
    let hasDegraded = false;

    const checkPromises = Array.from(this.checks.values()).map(
      async (check) => {
        const result = await check.check();
        results[check.name] = result;
        if (result.status === 'down') hasDown = true;
        else if (result.status === 'degraded') hasDegraded = true;
      },
    );

    await Promise.all(checkPromises);

    let status: 'healthy' | 'unhealthy' | 'degraded';
    if (hasDown) status = 'unhealthy';
    else if (hasDegraded) status = 'degraded';
    else status = 'healthy';

    return { status, checks: results };
  }
}
