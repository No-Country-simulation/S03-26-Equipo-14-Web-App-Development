import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  TestimonialStatus,
  TestimonialType,
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
  constructor(private readonly prisma: PrismaService) { }

  //addd Methods, get, delete, update

  async changeStatus({ id, status, type, rejectedReason }: ChangeStatusInput) {
    await this.prisma.client.testimonial.update({
      where: {
        id: id,
        type: type,
      },
      data: {
        status: status,
        ...(status === TestimonialStatus.rejected && { rejectedReason }),
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
      include: {
        category: true,
        testimonialTags: {
          include: {
            tag: true,
          }
        },
        member: {
          include: {
            organization_member: {
              select: {
                role: true,
                user: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          }
        }
      }
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

  async findById(id: string) {
    return this.prisma.client.testimonial.findUnique({
      where: { id },
      include: {
        category: true,
        testimonialTags: {
          include: {
            tag: true,
          },
        },
        member: {
          include: {
            organization_member: {
              select: {
                role: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOneById(
    id: string,
    select?: Prisma.TestimonialSelect,
  ): Promise<any> {
    return this.prisma.client.testimonial.findUnique({
      where: { id },
      select,
    });
  }

  async findAll(
    query: FindAllTestimonialsQuery,
    projectId: string,
  ): Promise<any[]> {
    const { orderBy, type, category_id, fragment } = query;
    const where: Prisma.TestimonialWhereInput = {};

    if (projectId) where.project_id = projectId;
    if (category_id) where.category_id = category_id;
    if (type) where.type = type as any;
    if (fragment) {
      where.OR = [
        {
          title: {
            contains: fragment,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: fragment,
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.prisma.client.testimonial.findMany({
      where,
      orderBy: orderBy ?? { created_at: 'desc' },
      include: {
        category: true,
        testimonialTags: {
          include: {
            tag: true,
          }
        },
        member: {
          include: {
            organization_member: {
              select: {
                role: true,
                user: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async createQuote(quote: CreateQuoteInput): Promise<any> {
    const {
      author,
      author_role,
      author_photo,
      content,
      project_id,
      rating,
      media_url,
    } = quote;
    return await this.prisma.client.testimonial.create({
      data: {
        project_id: project_id,
        type: TestimonialType.quote,

        author: author,
        author_role: author_role,
        author_photo: author_photo || '',
        content: content,
        media_url: media_url || '',
        rating: rating,
      },
    });
  }

  async createTestimonial(testimonial: CreateTestimonialInput) {
    const { tags, ...rest } = testimonial;

    await await this.prisma.client.testimonial.create({
      data: {
        ...rest,
        ...(tags?.length && {
          testimonialTags: {
            createMany: {
              data: tags.map((tagId) => ({ tag_id: tagId })),
            },
          },
        }),
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

    if (isDraft) {
      data.status = TestimonialStatus.draft;
    } else if (isRejected) {
      data.status = TestimonialStatus.pending;
    }

    return this.prisma.client.testimonial.update({
      where: { id },

      data: {
        ...(data.category_id && {
          category: { connect: { id: data.category_id } },
        }),

        title: data.title,
        content: data.content,
        author: data.author,
        author_photo: data.author_photo,
        author_role: data.author_role,
        media_url: data.media_url,
        media_description: data.media_description,
        slug: data.slug,
        status: data.status,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.client.testimonial.delete({ where: { id } });
  }
}
