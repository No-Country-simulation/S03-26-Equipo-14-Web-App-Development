import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagInput } from '@repo/api/src/repositories/interfaces';
import { TagRepository } from '@repo/api';

@Injectable()
export class TagService {
  constructor(private readonly apiTag: TagRepository) {}

  async create(name: string) {
    const newTag = await this.apiTag.create({ name });

    if (!newTag)
      throw new HttpException(
        'Failed to create, try again later',
        HttpStatus.NOT_FOUND,
      );

    return newTag;
  }

  async createMany(names: CreateTagInput[]) {
    try {
      const newTags = await this.apiTag.createMany(names);

      if (!newTags || newTags.length == 0)
        throw new HttpException(
          'It seems there is an error creating the tags, please, try again later.',
          HttpStatus.NOT_FOUND,
        );

      return newTags;
    } catch (error: Error | any) {
      throw new Error(error.message);
    }
  }

  async findAll() {
    try {
      const search = await this.apiTag.findAll();

      if (!search || search.length <= 0)
        throw new HttpException(
          'The search did not find the tags list. Please try again later.',
          HttpStatus.NOT_FOUND,
        );

      return search;
    } catch (error: Error | any) {
      throw new Error(error.message);
    }
  }

  async findOne(name: string) {
    try {
      const searchByName = await this.apiTag.findUniqueTag(name, 'name');

      if (!searchByName)
        throw new HttpException(
          'Welp, it looks like there is no tag with that name yet. Maybe you want to create one with another endpoint.',
          HttpStatus.NOT_FOUND,
        );

      return searchByName;
    } catch (error: Error | any) {
      throw new Error(error.message);
    }
  }

  async update(id: string, data: CreateTagInput) {
    try {
      const doesExists = await this.apiTag.findUniqueTag(id, 'id');

      if (!doesExists)
        throw new HttpException(
          "The Tag you're trying to update doesn't exist on the DB.",
          HttpStatus.NOT_FOUND,
        );

      const updatedTag = await this.apiTag.upd(data);

      if (!updatedTag)
        throw new HttpException(
          'The DB must have a little issue at the moment to update the tag. Please try again later.',
          HttpStatus.NOT_FOUND,
        );

      return updatedTag;
    } catch (error: Error | any) {
      throw new Error(error.message);
    }
  }

  async delete(id: string) {
    try {
      const doesExists = await this.apiTag.findUniqueTag(id, 'id');

      if (!doesExists)
        throw new HttpException(
          "The tag you're trying to delete doesn't exists.",
          HttpStatus.NOT_FOUND,
        );

      const deletedRecord = await this.apiTag.delete(id);
      if (!deletedRecord.id)
        throw new HttpException(
          'The tag to delete was not found.',
          HttpStatus.NOT_FOUND,
        );
      return deletedRecord;
    } catch (error: Error | any) {
      throw new Error(error?.message);
    }
  }
}
