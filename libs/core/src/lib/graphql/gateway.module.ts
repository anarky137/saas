import { Module } from '@nestjs/common';
import { GraphQLScalarDate } from './scalars/date.scalar';
import { GraphQLScalarUUID } from './scalars/uuid.scalar';

@Module({
  providers: [GraphQLScalarDate, GraphQLScalarUUID],
  exports: [GraphQLScalarDate, GraphQLScalarUUID],
})
export class GraphQLModule {}
