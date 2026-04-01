import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ProjectRepository,
  Testimonial,
  TestimonialRepository,
  TestimonialStatus,
  TestimonialType,
} from '@repo/api';
import {
  FindAllQueryTestimonialDto,
  GetByFragmentDto,
} from './dto/get-testimonial.dto';
import {
  CreateTestimonialDto,
  CreateTestimonialQuoteDto,
} from './dto/create-testimonial.dto';
import {
  ChangeStatusDto,
  UpdateTestimonialDto,
  UpdateTestimonialQuoteDto,
} from './dto/update-testimonial.dto';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class TestimonialsService {
  constructor(private readonly api: TestimonialRepository, private readonly projectRepository: ProjectRepository) {}

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

  async findAll(queryDto: FindAllQueryTestimonialDto, projectId: string, user: JwtPayload) {

    const allowedFields = ['created_at', 'rating', 'title'];

    const [field, order] = queryDto.sorted
      ? queryDto.sorted.split(':')
      : ['created_at', 'desc'];

    const safeField = allowedFields.includes(field!) ? field : 'created_at';
    const safeOrder = order === 'asc' ? 'asc' : 'desc';

    const orderBy = { [safeField!]: safeOrder };
    
    const project = await this.projectRepository.findOneById(projectId);

    if(!project) throw new NotFoundException('Project not found');
    if(project.organization_id !== user.organizationId) throw new NotFoundException('Project not found');

    return this.api.findAll({
      type: queryDto.type,
      category_id: queryDto.category_id,
      orderBy,
    }, projectId);
  }

  async searchByFragment({
    fragment,
  }: GetByFragmentDto): Promise<Testimonial[]> {
    return await this.api.findByFragment({ fragment });
  }

  async changeStatus(id: string, { status, type }: ChangeStatusDto) {
    if (status === TestimonialStatus.draft)
      throw new ConflictException(
        'You cannot set the status to “draft” from here',
      );

    if (
      type === TestimonialType.quote &&
      status === TestimonialStatus.pending
    ) {
      status = TestimonialStatus.review;
    }

    try {
      await this.api.changeStatus({ id, status, type });
      return { message: 'Status successfully changed' };
    } catch (error) {
      throw new ConflictException('Error changing status');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} testimonial`;
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto) {
    const { draft, ...updateData } = updateTestimonialDto;

    const { status, type }: { status: string | null; type: string | null } =
      await this.api.findOneById(id, { status: true, type: true });

    if (type === 'quote')
      throw new BadRequestException(`Cannot edit quote testimonials`);
    if (status === TestimonialStatus.published)
      throw new BadRequestException(
        `Cannot edit testimonials with status ${status}`,
      );

    const result = await this.api.updateTestimonial(
      id,
      updateData,
      draft,
      status === TestimonialStatus.rejected,
    );

    return {
      message: 'Testimonial updated successfully',
      testimonialUpdated: result,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} testimonial`;
  }
}
