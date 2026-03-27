import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Res,
  Query,
  Param,
} from '@nestjs/common';

import { TagService } from './tag.service';
import { CreateTagDto } from './dto/tags.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll() {
    const tagList = await this.tagService.findAll();
    if (tagList.length > 0)
      return { message: "Here's the Tag's List!", list: tagList };
    else return { message: "Something happened, let's see...", error: tagList };
  }

  @Get()
  async findOne(@Query('name') name: string) {
    const getByName = await this.tagService.findOne(name);

    return getByName.id
      ? { message: 'Tag found!', tag: getByName }
      : { message: "Something happened, let's see", issue: getByName };
  }

  @Post()
  async createTag(@Body() tagDto: CreateTagDto) {
    const newTag = await this.tagService.create(tagDto.name);

    return newTag.id
      ? { message: 'Tag Successfully Created!', tag: newTag }
      : { message: "Something happened, let's see", issue: newTag };
  }

  @Post('tags')
  async createTags(@Body() tagDto: CreateTagDto[]) {
    const theNewTags = await this.tagService.createMany(tagDto);

    return theNewTags.length > 0
      ? { message: 'Tags Successfully Created!', tags: theNewTags }
      : {
          message: "Something happened, let's see what we got here.",
          issue: theNewTags,
        };
  }

  @Patch(':id')
  async updateTag(@Param('id') id: string, @Body() updTagDto: CreateTagDto) {
    const updatedTag = await this.tagService.update(id, updTagDto);

    return updatedTag.id
      ? { message: 'Tag Successfully Updated!', tag: updatedTag }
      : { message: "Something happened, let's see", issue: updatedTag };
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: string) {
    const deletedRecord = await this.tagService.delete(id);

    return deletedRecord.id
      ? { message: 'Tag Successfully Deleted!', tag: deletedRecord }
      : { message: "Something happened, let's see", issue: deletedRecord };
  }
}
