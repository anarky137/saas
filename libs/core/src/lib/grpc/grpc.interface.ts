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
}
