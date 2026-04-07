import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialRepository, UserRepository } from '@repo/api';
import { ProjectRepository} from '@repo/api';

@Module({
  controllers: [TestimonialsController],
  providers: [TestimonialsService, TestimonialRepository, ProjectRepository, UserRepository],
})
export class TestimonialsModule {}
