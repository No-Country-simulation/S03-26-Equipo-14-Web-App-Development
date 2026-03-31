import { Injectable } from '@nestjs/common';

import { Tag } from '@workspace/database';
import { CreateTagInput } from './interfaces/tag.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (await this.prisma.client.tag.findMany()) as Tag[];
  }

  async findUniqueTag(searchFilter: string, type: string) {
    if (type == 'name') {
      return (await this.prisma.client.tag.findUnique({
        where: {
          name: searchFilter,
        },
        include: {
          projects: true,
          testimonialTags: true,
        },
      })) as Tag;
    } else {
      return (await this.prisma.client.tag.findUnique({
        where: {
          id: searchFilter,
        },
        include: {
          projects: true,
          testimonialTags: true,
        },
      })) as Tag;
    }
  }

  async findMany(tags: string[]) {
    return (await this.prisma.client.tag.findMany({
      where: {
        name: { in: tags },
      },
    })) as Tag[];
  }

  async create(data: CreateTagInput) {
    return await this.prisma.client.tag.create({
      data: {
        name: data.name,
      },
    });
  }

  async createMany(data: CreateTagInput[]) {
    return await this.prisma.client.tag.createManyAndReturn({
      data,
    });
  }

  async upd(data: CreateTagInput, id: string) {
    return await this.prisma.client.tag.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id2Delete: string) {
    const deletedTag = this.prisma.client.tag.delete({
      where: { id: id2Delete },
    });

    return await deletedTag;
  }
}
