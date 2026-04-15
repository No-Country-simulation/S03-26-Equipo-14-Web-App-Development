import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Testimonial,
  TestimonialStatus,
  TestimonialType,
} from '@workspace/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmbedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async verifyProject({
    projectId,
    orgId,
  }: {
    projectId: string;
    orgId: string;
  }) {
    const result = await this.prisma.client.project.findUnique({
      where: { id: projectId },
    });

    if (!result) return false;

    if (result.organization_id !== orgId) return false;
    return true;
  }

  async findAllPublishedTestimonials(
    projectId: string,
    type?: TestimonialType,
  ): Promise<Testimonial[]> {
    let where: Prisma.TestimonialWhereInput = {
      project_id: projectId,
      status: TestimonialStatus.published,
    };
    if (type && Object.values(TestimonialType).includes(type)) {
      where.type = type;
    }

    return await this.prisma.client.testimonial.findMany({
      where,
    });
  }
}

export type { Testimonial };
