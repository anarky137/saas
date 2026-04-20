import { SetMetadata } from '@nestjs/common';

export const EVENT_HANDLER_METADATA = 'event:handler';
export const KAFKA_TOPIC_METADATA = 'kafka:topic';

export function OnEvent(topic: string): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata(EVENT_HANDLER_METADATA, topic)(target, key, descriptor);
    SetMetadata(KAFKA_TOPIC_METADATA, topic)(target, key, descriptor);
    return descriptor;
  };
}
