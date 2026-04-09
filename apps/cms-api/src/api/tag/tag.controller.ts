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
import { CreateTagDto, searchTagDto } from './dto/tag.dto';
import { CreateTagInput } from '@repo/api';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

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

  @Get('byNames')
  async findMany(@Query('tags') tags: string[]) {
    console.log(tags);
    const manyTags = await this.tagService.find(tags);

    return manyTags;
  }
  @Post('tags')
  async createTags(@Body() tagDto: string[]) {
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
