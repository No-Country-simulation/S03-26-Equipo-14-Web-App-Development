import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from 'src/api/auth/decorators/public.decorator';

@Controller('categories/:projectId/')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // POST /categories/:projectId/
  @Post()
  create(@Param('projectId') projectId: string, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create( projectId, createCategoryDto);
  }

  // GET /categories/:projectId/
  @Public()
  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.categoryService.findAll(projectId);
  }

  // GET /categories/:projectId/:id
  @Get(':id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.categoryService.findOne(id, projectId);
  }

  // PATCH /categories/:projectId/:id
  @Patch(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, projectId, updateCategoryDto);
  }

  // DELETE /categories/:projectId/:id
  @Delete(':id')
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.categoryService.remove(id, projectId);
  }
}