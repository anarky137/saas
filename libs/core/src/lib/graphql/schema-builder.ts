export interface SchemaConfig {
  path?: string;
  playground?: boolean;
  debug?: boolean;
}

export async function createSchema(): Promise<unknown> {
  return {};
}

export function printGraphQLSchema(_schema: unknown): string {
  return '';
}
