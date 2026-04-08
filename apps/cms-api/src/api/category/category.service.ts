import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from '@repo/api';

@Injectable()
export class CategoryService {
  constructor(private readonly api: CategoryRepository) {}

  async create(projectId: string, createCategoryDto: CreateCategoryDto) {
    return await this.api.create(projectId, createCategoryDto);
  }

  async findAll(projectId: string) {
    const categories = await this.api.findAll(projectId);
    if (!categories) throw new NotFoundException('Categories not found');
    return categories;
  }

  async findOne(id: string, projectId: string) {
    const category = await await this.api.findOne(id, projectId);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(
    id: string,
    projectId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.findOne(id, projectId);
    try {
      return await this.api.update({
        projectId: projectId,
        categoryId: id,
        name: updateCategoryDto.name!,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('record not found');
      }

      throw error;
    }
  }

  async remove(id: string, projectId: string) {
    try {
      const record = await this.findOne(id, projectId);
      return await this.api.deleteById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Record not found');
      }

      throw error;
    }
  }
}
