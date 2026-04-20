import { GraphQLScalarType, Kind } from 'graphql';

export const GraphQLScalarDate = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: Date): number {
    if (value instanceof Date) {
      return value.getTime();
    }
    throw new Error('Value must be a Date instance');
  },
  parseValue(value: number): Date {
    return new Date(value);
  },
  parseLiteral(ast): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});
