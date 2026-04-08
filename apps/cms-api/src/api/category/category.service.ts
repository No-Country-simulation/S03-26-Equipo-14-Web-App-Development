import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from '@repo/api';

@Injectable()
export class CategoryService {
  constructor(private readonly api: CategoryRepository) {}

  create(projectId: string, createCategoryDto: CreateCategoryDto) {
    return this.api.create(projectId, createCategoryDto);
  }

  findAll(projectId: string) {
    return this.api.findAll(projectId);
  }

  findOne(id: string, projectId: string) {
    return this.api.findOne(id, projectId);
  }

  update(id: string, projectId: string, updateCategoryDto: UpdateCategoryDto) {
    return this.api.update({
      projectId: projectId,
      categoryId: id,
      name: updateCategoryDto.name!,
    });
  }

  remove(id: string, projectId: string) {
    return this.api.deleteById(id, projectId);
  }
}
