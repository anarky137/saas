import { GraphQLScalarType, Kind } from 'graphql';

export const GraphQLScalarUUID = new GraphQLScalarType({
  name: 'UUID',
  description: 'UUID custom scalar type',
  serialize(value: string): string {
    return value;
  },
  parseValue(value: string): string {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('Invalid UUID format');
    }
    return value;
  },
  parseLiteral(ast): string {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});
