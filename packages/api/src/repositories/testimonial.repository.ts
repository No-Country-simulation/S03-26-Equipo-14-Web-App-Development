import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  TestimonialStatus,
} from '@workspace/database';
import { Testimonial } from '@workspace/database';
import {
  ChangeStatusInput,
  CreateQuoteInput,
  CreateTestimonialInput,
  FindAllTestimonialsQuery,
  FindByFragment,
} from './interfaces/testimonial.interface';
//import { PartialType } from '@nestjs/mapped-types';

@Injectable()
export class TestimonialRepository {
  constructor(private readonly prisma: PrismaService) {}

  //addd Methods, get, delete, update

  async changeStatus({ id, status, type }: ChangeStatusInput) {
    await this.prisma.client.testimonial.update({
      where: {
        id: id,
        type: type,
      },
      data: {
        status: status,
      },
    });
  }

  async findByFragment({ fragment }: FindByFragment): Promise<Testimonial[]> {
    console.log('api', fragment);

    return this.prisma.client.testimonial.findMany({
      where: {
        OR: [
          { title: { contains: fragment, mode: 'insensitive' } },
          { content: { contains: fragment, mode: 'insensitive' } },
        ],
      },
    });
  }

  async findByIdSelectOrganizationId(id: string) {
    return this.prisma.client.testimonial.findUnique({
      where: { id },
      select: {
        project: {
          select: {
            organization_id: true,
          },
        },
      },
    });
  }

  async findOneById(
    id:  string,
    select?: Prisma.TestimonialSelect,
  ): Promise<any> {
    return this.prisma.client.testimonial.findUnique({
      where: { id },
      select,
    });
  }

  async findAll(query: FindAllTestimonialsQuery, projectId: string): Promise<any[]> {
    const { orderBy, type, category_id } = query;

    const where: Prisma.TestimonialWhereInput = {};

    if(projectId) where.project_id = projectId;
    if (category_id) where.category_id = category_id;
    if (type) where.type = type as any;

    return this.prisma.client.testimonial.findMany({
      where,
      orderBy: orderBy ?? { created_at: 'desc' },
    });
  }

  async createQuote(quote: CreateQuoteInput) {
    await await this.prisma.client.testimonial.create({
      data: {
        ...quote,
      },
    });
  }

  async createTestimonial(testimonial: CreateTestimonialInput) {
    console.log('repo', testimonial);
    await await this.prisma.client.testimonial.create({
      data: {
        ...testimonial,
      },
    });
  }

  async updateTestimonial(
    id: string,
    updateData: Partial<CreateTestimonialInput>,
    isDraft: boolean,
    isRejected: boolean,
  ): Promise<any> {
    const data = {
      ...updateData,
    };

    if (isRejected && !isDraft) data.status = TestimonialStatus.pending;
    isDraft
      ? (data.status = TestimonialStatus.draft)
      : (data.status = TestimonialStatus.pending);

    return this.prisma.client.testimonial.update({
      where: { id },
      data,
    });
  }

  async delete(id: string){
    return await this.prisma.client.testimonial.delete({where:{id}});
  }
}
