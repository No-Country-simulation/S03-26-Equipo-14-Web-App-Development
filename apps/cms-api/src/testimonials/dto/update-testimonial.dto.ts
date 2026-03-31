import { PartialType } from '@nestjs/swagger';
import { CreateTestimonialQuoteDto } from './create-testimonial.dto';

export class UpdateTestimonialQuoteDto extends PartialType(
  CreateTestimonialQuoteDto,
) {}
