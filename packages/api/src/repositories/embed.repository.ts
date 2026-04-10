import { Injectable } from '@nestjs/common';
import { Prisma, Testimonial, TestimonialStatus } from '@workspace/database';
import { PrismaService } from 'src/prisma/prisma.service';

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
  ): Promise<Testimonial[]> {
    return await this.prisma.client.testimonial.findMany({
      where: {
        project_id: projectId,
        status: TestimonialStatus.published,
      },
    });
  }
}

export type { Testimonial };
