export interface GrpcClientOptions {
  name: string;
  package: string;
  protoPath: string;
  url: string;
}

export interface GrpcServerOptions {
  package: string;
  protoPath: string;
  url: string;
  host?: string;
}

export interface GrpcMethod {
  name: string;
  path: string;
  requestStream?: boolean;
  responseStream?: boolean;
}

export interface GrpcServiceDefinition {
  package: string;
  serviceName: string;
  methods: GrpcMethod[];
}

export const AUTH_SERVICE_NAME = 'auth';
export const USER_SERVICE_NAME = 'user';
export const NOTIFICATION_SERVICE_NAME = 'notification';
