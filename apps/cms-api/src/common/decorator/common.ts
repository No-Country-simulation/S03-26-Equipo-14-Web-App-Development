import { applyDecorators } from '@nestjs/common';
import {
  IsString,
  IsNotEmpty,
  isNotEmpty,
  isEAN,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export function IsRequiredString() {
  return applyDecorators(
    Transform(({ value }) => value?.trim()),
    IsString(),
    IsNotEmpty(),
  );
}

export function IsRequiredEnum(type: object) {
  return applyDecorators(IsNotEmpty(), IsEnum(type));
}

export function IsRequiredEnumWithDefault(
  enumType: object,
  defaultType: unknown,
) {
  return applyDecorators(
    Transform(({ value }) => value ?? defaultType),
    IsEnum(enumType),
    IsNotEmpty(),
  );
}
