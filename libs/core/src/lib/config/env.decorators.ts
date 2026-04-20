import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsEnv(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          return /^(development|staging|production|test)$/.test(value);
        },
      },
    });
  };
}

export function IsNodeEnv(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          return /^(development|production|test)$/.test(value);
        },
      },
    });
  };
}
