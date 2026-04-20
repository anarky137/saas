import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HealthCheck, HealthCheckResponse } from './health-check.interface';

@Injectable()
export class DatabaseHealthCheck extends HealthCheck {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  readonly name = 'database';

  protected async performCheck(): Promise<Partial<HealthCheckResponse>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query('SELECT 1');
    await queryRunner.release();

    const result = await this.dataSource.query('SELECT 1');
    const version = result?.[0]?.version;

    return {
      metadata: { version },
    };
  }
}
