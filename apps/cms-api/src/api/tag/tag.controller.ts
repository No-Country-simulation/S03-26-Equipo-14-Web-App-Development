import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';

import { TagService } from './tag.service';
import { CreateTagDto } from './dto/tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async createTag(@Body() tagDto: CreateTagDto) {
    const newTag = await this.tagService.create(tagDto.name);

    return newTag;
  }
  @Get()
  async findAll() {
    return await this.tagService.findAll();
  }

  @Get('byName')
  async findOne(@Query('name') name: string) {
    const getByName = await this.tagService.find(name);

    return getByName;
  }

  @Post('byNames')
  async findMany(@Body() tagsDto: string[]) {
    const manyTags = await this.tagService.find(tagsDto);

    return manyTags;
  }
  @Post('tags')
  async createTags(@Body() tagDto: CreateTagDto[]) {
    const theNewTags = await this.tagService.createMany(tagDto);

    return theNewTags;
  }

  @Patch(':id')
  async updateTag(@Param('id') id: string, @Body() updTagDto: CreateTagDto) {
    const updatedTag = await this.tagService.update(id, updTagDto);

    return updatedTag;
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: string) {
    const deletedRecord = await this.tagService.delete(id);

    return deletedRecord;
  }
}
