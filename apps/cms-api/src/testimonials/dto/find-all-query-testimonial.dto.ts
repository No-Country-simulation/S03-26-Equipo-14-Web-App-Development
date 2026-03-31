import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  NotContains,
} from 'class-validator';

export class FindAllQueryTestimonialDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  sorted?: string;
}

export class GetByFragmentDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  fragment!: string;
}
