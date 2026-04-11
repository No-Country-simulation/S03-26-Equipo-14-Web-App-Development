import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import {
  ProjectRepository,
  Testimonial,
  TestimonialRepository,
  TestimonialStatus,
  TestimonialType,
  UserRepository,
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
import { JwtPayload } from 'src/api/auth/types/jwt-payload.type';
import { deleteTestimonialDTO } from './dto/delete-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    private readonly api: TestimonialRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly userApi: UserRepository,
  ) {}

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

    return await this.api.createQuote(synthTestimonial);
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

  async findAll(
    queryDto: FindAllQueryTestimonialDto,
    projectId: string,
    user: JwtPayload,
  ) {
    const allowedFields = ['created_at', 'rating', 'title'];

    const [field, order] = queryDto.sorted
      ? queryDto.sorted.split(':')
      : ['created_at', 'desc'];

    const safeField = allowedFields.includes(field!) ? field : 'created_at';
    const safeOrder = order === 'asc' ? 'asc' : 'desc';

    const orderBy = { [safeField!]: safeOrder };

    const project = await this.projectRepository.findOneById(projectId);

    if (!project) throw new NotFoundException('Project not found');
    if (project.organization_id !== user.organizationId)
      throw new NotFoundException('Project not found');

    console.log(queryDto)

    return this.api.findAll(
      {
        type: queryDto.type,
        category_id: queryDto.category_id,
        orderBy,
        fragment: queryDto.fragment,
      },
      projectId,
    );
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

  findOne(id: string) {
    if (!id) throw new BadRequestException('query parameter not found');
    return this.api.findById(id);
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

  async removeT(
    testimonialId: string,
    userId: deleteTestimonialDTO,
  ): Promise<string> {
    try {
      //First Things First: User's Role
      const verifyRole = await this.userApi.findById(userId.userId);

      if (verifyRole?.organizationMembers[0]?.role == 'Editor')
        throw new NotAcceptableException(
          'Only the Owner and the Admin can use this functionality.',
        );

      //Second things Second: Verify Testimonial
      const testimonialExists = await this.api.findOneById(testimonialId, {
        id: true,
        title: true,
        status: true,
      });
      console.log(testimonialExists);
      if (!testimonialExists)
        throw new NotFoundException(
          "The Testimonial you want to delete doesn't exists on the DB. Have a nice day!",
        );
      else if (testimonialExists?.status != 'rejected')
        throw new NotAcceptableException(
          'You can only delete a Testimonial if it was rejected...',
        );
      //Third thing Third: Deleting the testimonial
      const deletedTestimonial = await this.api.delete(testimonialId);

      if (!deletedTestimonial?.id)
        throw new ConflictException(
          'There was an error deleting the testimonial. Try again later or with another id.',
        );
      console.log(deletedTestimonial);
      return 'Success Deleting the Testimonial';
    } catch (error: Error | any) {
      throw new ConflictException(error.message);
    }
  }
}
