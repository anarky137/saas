import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthCheckExecutor } from './health-check.interface';

@Module({
  controllers: [HealthController],
  providers: [HealthCheckExecutor],
  exports: [HealthCheckExecutor],
})
export class HealthModule {}
