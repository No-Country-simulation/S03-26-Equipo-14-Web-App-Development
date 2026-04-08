import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@workspace/database';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './interfaces/category.interface';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string) {
    return (await this.prisma.client.category.findMany({
      where: {
        project_id: projectId,
      },
    })) as Category[];
  }

  async findOne(projectId: string, categoryId: string) {
    return await this.prisma.client.category.findUnique({
      where: {
        project_id: projectId,
        id: categoryId,
      },
    });
  }

  async create(projectId: string, data: CreateCategoryInput) {
    return await this.prisma.client.category.create({
      data: {
        ...data,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }

  async update(data: UpdateCategoryInput) {
    return await this.prisma.client.category.update({
      where: { project_id: data.projectId, id: data.categoryId },
      data: { name: data.name },
    });
  }

  async deleteById(projectId: string, id: string) {
    return await this.prisma.client.category.delete({
      where: {
        id: id,
        project_id: projectId,
      },
    });
  }
}
