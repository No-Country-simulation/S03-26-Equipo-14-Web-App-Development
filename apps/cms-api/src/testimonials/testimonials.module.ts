import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialRepository } from '@repo/api';

@Module({
  controllers: [TestimonialsController],
  providers: [TestimonialsService, TestimonialRepository],
})
export class TestimonialsModule {}
