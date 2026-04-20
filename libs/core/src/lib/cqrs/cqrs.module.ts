import { Module } from '@nestjs/common';
import { CqrsModule as NestCqrsModule } from '@nestjs/cqrs';

export const COMMANDS = [];
export const QUERIES = [];
export const EVENT_HANDLERS = [];

@Module({
  imports: [NestCqrsModule],
  exports: [NestCqrsModule],
})
export class AppCqrsModule {}
