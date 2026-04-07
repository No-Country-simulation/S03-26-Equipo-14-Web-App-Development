import { OmitType, PartialType } from '@nestjs/swagger';
import {
  CreateTestimonialDto,
  CreateTestimonialQuoteDto,
} from './create-testimonial.dto';
import { IsBoolean } from 'class-validator';
import { IsEnum, IsString } from 'class-validator';
import { TestimonialStatus, TestimonialType } from '@repo/api';
import { IsRequiredString } from 'src/api/common/decorator/common';

export class UpdateTestimonialDto extends PartialType(
  OmitType(CreateTestimonialDto, [
    'type',
    'status',
    'memberId',
    'projectId',
  ] as const),
) {
  @IsBoolean()
  draft: boolean = false;
}

export class UpdateTestimonialQuoteDto extends PartialType(
  CreateTestimonialQuoteDto,
) {}

export class ChangeStatusDto {
/*   @IsRequiredString()
  id!: string; */
  @IsRequiredString()
  @IsEnum(TestimonialType)
  type!: TestimonialType;
  @IsRequiredString()
  @IsEnum(TestimonialStatus)
  status!: TestimonialStatus;
}
