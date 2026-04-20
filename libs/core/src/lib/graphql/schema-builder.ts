import { GraphQLSchema } from 'graphql';
import { buildSchema, printSchema } from 'type-graphql';
import { resolvers } from '../type-graphql';

export async function createSchema(): Promise<GraphQLSchema> {
  const schema = await buildSchema({
    resolvers,
    validate: true,
    emitSchemaFile: process.env.NODE_ENV !== 'production',
  });
  return schema;
}

export function printGraphQLSchema(schema: GraphQLSchema): string {
  return printSchema(schema);
}

export interface SchemaConfig {
  path?: string;
  playground?: boolean;
  debug?: boolean;
}
