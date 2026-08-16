import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from 'src/api/auth/decorators/public.decorator';
import { ParamsDto } from './dto/param-category.dto';

@Controller('categories/:projectId/')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // POST /categories/:projectId/
  @Post()
  create(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(projectId, createCategoryDto);
  }

  // GET /categories/:projectId/
  @Public()
  @Get()
  findAll(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.categoryService.findAll(projectId);
  }

  // GET /categories/:projectId/:id
  @Get(':id')
  findOne(@Param() params: ParamsDto) {
    return this.categoryService.findOne(params.id, params.projectId);
  }

  // PATCH /categories/:projectId/:id
  @Patch(':id')
  update(
    @Param() params: ParamsDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(
      params.id,
      params.projectId,
      updateCategoryDto,
    );
  }

  // DELETE /categories/:projectId/:id
  @Delete(':id')
  remove(@Param() params: ParamsDto) {
    return this.categoryService.remove(params.id, params.projectId);
  }
}
