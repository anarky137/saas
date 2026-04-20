export interface GrpcClientOptions {
  name: string;
  package: string;
  protoPath: string;
  url: string;
  loader?: {
    keepCase?: boolean;
    longs?: string | Function;
    enums?: String | Function;
    defaults?: boolean;
    oneofs?: boolean;
  };
}

export interface GrpcServerOptions {
  package: string;
  protoPath: string;
  url: string;
  loader?: {
    keepCase?: boolean;
    longs?: string | Function;
    enums?: String | Function;
    defaults?: boolean;
    oneofs?: boolean;
  };
}

export const GRPC_SERVER_OPTIONS = 'GRPC_SERVER_OPTIONS';
