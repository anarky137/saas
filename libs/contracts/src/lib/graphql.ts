export interface GraphQLResolverOptions {
  path?: string;
  playground?: boolean;
  debug?: boolean;
}

export interface GraphQLField {
  name: string;
  type: string;
  args?: Record<string, string>;
  resolver?: string;
}

export interface GraphQLObjectType {
  name: string;
  fields: GraphQLField[];
  interfaces?: string[];
}

export interface GraphQLSchemaDefinition {
  types: GraphQLObjectType[];
  queries?: GraphQLField[];
  mutations?: GraphQLField[];
}

export const DEFAULT_GRAPHQL_PATH = '/graphql';
export const DEFAULT_PLAYGROUND_PATH = '/playground';

export const SUBGRAPH_CONFIG = {
  AUTH: { name: 'auth', url: '' },
  USER: { name: 'user', url: '' },
  NOTIFICATION: { name: 'notification', url: '' },
} as const;
