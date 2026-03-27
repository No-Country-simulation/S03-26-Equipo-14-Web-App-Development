import { Injectable } from '@nestjs/common';

import { Tag } from '@workspace/database';
import { CreateTagInput } from './interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (await this.prisma.client.tag.findMany()) as Tag[];
  }

  async findUniqueTag(searchFilter: string, type: string) {
    let name, id;

    if (type == 'name') name = searchFilter;
    else id = searchFilter;

    return (await this.prisma.client.tag.findUnique({
      where: {
        ...(type == 'name' ? name : id),
      },
      include: {
        projects: true,
        testimonialTags: true,
      },
    })) as Tag;
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

  async upd(data: CreateTagInput) {
    return await this.prisma.client.tag.update({
      where: {
        name: data.name,
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
