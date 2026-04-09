import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagInput } from '@repo/api/src/repositories/interfaces/tag.interface';
import { TagRepository } from '@repo/api';
import { CreateTagDto } from './dto/tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly apiTag: TagRepository) { }

  async create(name: string) {
    try {
      const doesExists = await this.apiTag.findUniqueTag(name, 'name');

      if (doesExists)
        throw new NotAcceptableException(
          'The tag you want to create already exists.',
        );
      const newTag = await this.apiTag.create({ name });
      if (!newTag)
        throw new NotFoundException('Failed to create, try again later');

      return 'Tag Successfully Created!';
    } catch (error: Error | any) {
      throw new ConflictException(error.message);
    }
  }

  async createMany(names: string[]) {
    try {
      //Verify
      if (!names || names.length == 0)
        throw new NotAcceptableException(
          'You must send an array with at least two tag objects to create.',
        );

      const verify = await this.find(names, true);

      if (Array.isArray(verify) && verify.length > 0)
        throw new NotAcceptableException(
          `There are at least ${verify.length} tag object that matches your suggested names. There cannot be duplicates.`,
        );
const f: CreateTagInput[] = [];
names.forEach((str)=>{
  f.push({name: str});
})
const newTags = await this.apiTag.createMany(f);

      if (!newTags || newTags.count < 1)
        throw new NotFoundException(
          'It seems there is an error creating the tags, please, try again later.',
        );

      return 'Tags SuccessFully Created!';
    } catch (error: Error | any) {
      throw new ConflictException(error.message);
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
      throw new ConflictException(error.message);
    }
  }

  async find(name: string | string[], create?: boolean) {
    try {
      if (typeof name == 'string') {
        const searchByName = await this.apiTag.findUniqueTag(name, 'name');

        if (!searchByName) {
          throw new NotFoundException(
            'Welp, it looks like there is no tag with that name yet. Maybe you want to create one with another endpoint.',
          );
        }

        return searchByName;
      } else {

        const searchManyTags = await this.apiTag.findMany(name);
        if (create) return searchManyTags;
        if (searchManyTags.length < 1)
          throw new NotFoundException('Tags were not found.');
        return searchManyTags;
      }
    } catch (error: Error | any) {
      throw new ConflictException(error.message);
    }
  }

  async update(id: string, data: CreateTagInput) {
    try {
      const doesExists = await this.apiTag.findUniqueTag(id, 'id');

      if (!doesExists)
        throw new NotFoundException(
          "The Tag you're trying to update doesn't exist on the DB.",
        );

      const updatedTag = await this.apiTag.upd(data, doesExists?.id);

      if (!updatedTag)
        throw new NotFoundException(
          'The DB must have a little issue at the moment to update the tag. Please try again later.',
        );

      return "Tag Updated Successfully!";
    } catch (error: Error | any) {
      throw new ConflictException(error.message);
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
      return "Tag Successfully Deleted!";
    } catch (error: Error | any) {
      throw new ConflictException(error.message);
    }
  }
}
