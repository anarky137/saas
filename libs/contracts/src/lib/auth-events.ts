export const AUTH_TOPICS = {
  USER_REGISTERED: 'auth.user.registered',
  USER_LOGGED_IN: 'auth.user.logged_in',
  USER_LOGGED_OUT: 'auth.user.logged_out',
  PASSWORD_CHANGED: 'auth.user.password_changed',
  ACCOUNT_SUSPENDED: 'auth.account.suspended',
  SESSION_REVOKED: 'auth.session.revoked',
  ALL_SESSIONS_REVOKED: 'auth.all_sessions.revoked',
} as const;

export type AuthTopic = (typeof AUTH_TOPICS)[keyof typeof AUTH_TOPICS];

export interface AuthEvent<T = unknown> {
  type: string;
  occurredAt: string;
  payload: T & { accountId: string; sessionId?: string };
}

export interface UserRegisteredPayload {
  accountId: string;
  email: string | null;
  provider: string;
}

export interface UserLoggedInPayload {
  accountId: string;
  sessionId: string;
  provider: string;
  ipAddress: string | null;
}

export interface SessionRevokedPayload {
  accountId: string;
  sessionId: string;
  reason: string | null;
}

export const TOPIC_BY_EVENT_TYPE: Record<string, string> = {
  'user.registered': AUTH_TOPICS.USER_REGISTERED,
  'user.logged_in': AUTH_TOPICS.USER_LOGGED_IN,
  'user.logged_out': AUTH_TOPICS.USER_LOGGED_OUT,
  'user.password_changed': AUTH_TOPICS.PASSWORD_CHANGED,
  'account.suspended': AUTH_TOPICS.ACCOUNT_SUSPENDED,
  'session.revoked': AUTH_TOPICS.SESSION_REVOKED,
  'all_sessions.revoked': AUTH_TOPICS.ALL_SESSIONS_REVOKED,
};
