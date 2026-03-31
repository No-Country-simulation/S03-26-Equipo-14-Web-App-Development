import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTestimonialDto, CreateTestimonialQuoteDto } from './create-testimonial.dto';
import { IsBoolean } from 'class-validator';

export class UpdateTestimonialDto extends PartialType(
  OmitType(CreateTestimonialDto, ["type", "status", "memberId", "projectId"] as const)
) {
  @IsBoolean()
  draft : boolean = false
}
