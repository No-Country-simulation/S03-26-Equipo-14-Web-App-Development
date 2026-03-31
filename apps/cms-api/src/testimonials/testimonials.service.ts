import { BadRequestException, Injectable } from '@nestjs/common';
import { Testimonial, TestimonialRepository } from '@repo/api';
import {
  FindAllQueryTestimonialDto,
  GetByFragmentDto,
} from './dto/find-all-query-testimonial.dto';
import {
  CreateTestimonialDto,
  CreateTestimonialQuoteDto,
} from './dto/create-testimonial.dto';
import { UpdateTestimonialQuoteDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private readonly api: TestimonialRepository) {}

  async creatQuote(
    createTestimonialDto: CreateTestimonialQuoteDto,
  ): Promise<void> {
    const { projectId, authorPhoto, authorRole, mediaUrl, ...testimonial } =
      createTestimonialDto;
    const synthTestimonial = {
      project_id: projectId,
      author_photo: authorPhoto,
      author_role: authorRole,
      media_url: mediaUrl,
      ...testimonial,
    };

    await this.api.createQuote(synthTestimonial);
  }

  async createTestimonial(createTestimonialDto: CreateTestimonialDto) {
    console.log('service', createTestimonialDto);
    const {
      categoryId,
      memberId,
      projectId,
      authorPhoto,
      authorRole,
      mediaDescription,
      mediaUrl,
      ...testimonial
    } = createTestimonialDto;

    const synthTestimonial = {
      category_id: categoryId,
      member_id: memberId,
      project_id: projectId,
      author_photo: authorPhoto,
      author_role: authorRole,
      media_url: mediaUrl,
      media_description: mediaDescription,
      ...testimonial,
    };

    await this.api.createTestimonial(synthTestimonial);
  }

  findAll(queryDto: FindAllQueryTestimonialDto) {
    const allowedFields = ['created_at', 'rating', 'title'];

    const [field, order] = queryDto.sorted
      ? queryDto.sorted.split(':')
      : ['created_at', 'desc'];

    const safeField = allowedFields.includes(field!) ? field : 'created_at';
    const safeOrder = order === 'asc' ? 'asc' : 'desc';

    const orderBy = { [safeField!]: safeOrder };

    return this.api.findAll({
      type: queryDto.type,
      category_id: queryDto.category_id,
      orderBy,
    });
  }

  async searchByFragment({ fragment }: GetByFragmentDto): Promise<Testimonial[]>  {
    return await this.api.findByFragment({ fragment });
  }

  findOne(id: number) {
    return `This action returns a #${id} testimonial`;
  }

  update(id: number, updateTestimonialDto: UpdateTestimonialQuoteDto) {
    return `This action updates a #${id} testimonial`;
  }

  remove(id: number) {
    return `This action removes a #${id} testimonial`;
  }
}
