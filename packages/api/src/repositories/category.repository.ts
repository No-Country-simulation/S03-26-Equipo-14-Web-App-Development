import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@workspace/database';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryInput, UpdateCategoryInput } from './interfaces';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (await this.prisma.client.category.findMany()) as Category[];
  }

  async create(data: CreateCategoryInput) {
    return await this.prisma.client.category.create({
      data: {
        ...data,
      },
    });
  }

  async update(data: UpdateCategoryInput) {
    return await this.prisma.client.category.update({
      where: { id: data.categoryId },
      data: { name: data.name },
    });
  }

  async deleteById(id: string) {
    return await this.prisma.client.category.delete({
      where: {
        id: id,
      },
    });
  }
}
