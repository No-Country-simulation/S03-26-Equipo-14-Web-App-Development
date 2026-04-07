import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from '@repo/api';

@Injectable()
export class CategoryService {
  constructor(private readonly api: CategoryRepository) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.api.create(createCategoryDto);
  }

  findAll() {
    return this.api.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.api.update({
      categoryId: id,
      name: updateCategoryDto.name!,
    });
  }

  remove(id: string) {
    return this.api.deleteById(id);
  }
}
