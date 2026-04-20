export interface IEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
  readonly payload: unknown;
}

export abstract class Event<T = unknown> implements IEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
  readonly payload: T;

  constructor(payload: T) {
    this.eventName = this.constructor.name;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}

export interface IEventHandler<TEvent extends IEvent> {
  handle(event: TEvent): Promise<void>;
}

export abstract class EventHandler<TEvent extends IEvent> {
  async handle(event: TEvent): Promise<void> {
    await this.onEvent(event);
  }

  protected abstract onEvent(event: TEvent): Promise<void>;
}
