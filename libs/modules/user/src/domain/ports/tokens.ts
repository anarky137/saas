import { InjectionToken } from '@nestjs/common';

export const USER_REPOSITORY = Symbol.for('UserRepository') as InjectionToken;
export const PROFILE_REPOSITORY = Symbol.for('ProfileRepository') as InjectionToken;
export const USER_EVENT_PUBLISHER = Symbol.for('UserEventPublisher') as InjectionToken;
