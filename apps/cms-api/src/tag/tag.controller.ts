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

    return newTag.id
      ? { message: 'Successfull', tag: newTag }
      : { message: 'Something went wrong', issue: newTag };
  }

  @Get()
  async findAll() {
    const tagList = await this.tagService.findAll();
    if (tagList.length > 0)
      return { message: "Here's the Tag's List!", list: tagList };
    else return { message: "Something happened, let's see...", error: tagList };
  }

  @Get('byName')
  async findOne(@Query('name') name: string) {
    const getByName = await this.tagService.find(name);

    return (!Array.isArray(getByName)) && getByName.id
      ? { message: 'Tag found!', tag: getByName }
      : { message: "Something happened, let's see", issue: getByName };
  }

  @Post('byNames')
  async findMany(@Body() tagsDto: string[]) {
    const manyTags = await this.tagService.find(tagsDto);

    return Array.isArray(manyTags) && manyTags.length > 0
      ? { message: "Here's the list of Found Matched Tags", tags: manyTags }
      : {
          message:
            "There aren't any Tag that matches your list of tag names...",
        };
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
