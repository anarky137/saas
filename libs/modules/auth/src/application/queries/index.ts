export class GetAccountByIdQuery {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class GetAccountByUserIdQuery {
  readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}

export class GetSessionByIdQuery {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class GetSessionsByAccountIdQuery {
  readonly accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }
}

export class VerifyTokenQuery {
  readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}
