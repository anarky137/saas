export interface ICommand {
  readonly id: string;
}

export interface ICommandHandler<TCommand extends ICommand, TResult> {
  execute(command: TCommand): Promise<TResult>;
}

export abstract class Command<T = void> implements ICommand {
  readonly id: string;

  constructor() {
    this.id = crypto.randomUUID();
  }
}

export interface IQuery {
  readonly id: string;
}

export interface IQueryHandler<TQuery extends IQuery, TResult> {
  execute(query: TQuery): Promise<TResult>;
}

export abstract class Query<T = void> implements IQuery {
  readonly id: string;

  constructor() {
    this.id = crypto.randomUUID();
  }
}
