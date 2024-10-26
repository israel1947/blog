import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsAllowedRole(groups: string[], validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'IsAllowedRole',
      target: object.constructor,
      propertyName,
      constraints: groups, 
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const allowedRoles = args.constraints; 
          return allowedRoles.includes(value);
        },
      },
    });
}
