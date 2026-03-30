import { Injectable } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialRepository } from '@repo/api';
import { TestimonialType } from '../../../../packages/database/dist';
import { FindAllQueryTestimonialDto } from './dto/find-all-query-testimonial.dto';

@Injectable()
export class TestimonialsService {

  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  create(createTestimonialDto: CreateTestimonialDto) {
    return 'This action adds a new testimonial';
  }

  findAll(queryDto: FindAllQueryTestimonialDto) {

    return this.testimonialRepository.findAll(queryDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} testimonial`;
  }

  update(id: number, updateTestimonialDto: UpdateTestimonialDto) {
    return `This action updates a #${id} testimonial`;
  }

  remove(id: number) {
    return `This action removes a #${id} testimonial`;
  }

}
