import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateTagInput } from '@repo/api/src/repositories/interfaces';
import { TagRepository } from '@repo/api/src/repositories/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly apiTag: TagRepository) {}

  async create(name: string) {
    try {
      const newTag = await this.apiTag.create({ name });

      if (!newTag)
        throw new ServiceUnavailableException(
          'It seems like the DB had some trouble creating the tag. Have some coffee and try again later.',
        );

      return newTag;
    } catch (error: Error | any) {
      throw new Error(error?.message);
    }
  }

  async createMany(names: CreateTagInput[]) {
    try {
      const newTags = await this.apiTag.createMany(names);

      if (!newTags || newTags.length == 0)
        throw new NotFoundException(
          'It seems there is an error creating the tags, please, try again later.',
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
        throw new NotFoundException(
          'The search did not find the tags list. Please try again later.',
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
        throw new NotFoundException(
          'Welp, it looks like there is no tag with that name yet. Maybe you want to create one with another endpoint.',
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
        throw new NotFoundException(
          "The Tag you're trying to update doesn't exist on the DB.",
        );

      const updatedTag = await this.apiTag.upd(data);

      if (!updatedTag)
        throw new NotFoundException(
          'The DB must have a little issue at the moment to update the tag. Please try again later.',
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
        throw new NotFoundException(
          "The tag you're trying to delete doesn't exists.",
        );

      const deletedRecord = await this.apiTag.delete(id);
      if (!deletedRecord.id)
        throw new NotFoundException('The tag to delete was not found.');
      return deletedRecord;
    } catch (error: Error | any) {
      throw new Error(error?.message);
    }
  }
}
