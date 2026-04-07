import { Injectable } from '@nestjs/common';
import { CreateEmbedDto } from './dto/create-embed.dto';
import { UpdateEmbedDto } from './dto/update-embed.dto';

@Injectable()
export class EmbedService {
  create(createEmbedDto: CreateEmbedDto) {
    return 'This action adds a new embed';
  }

  findAll() {
    return `This action returns all embed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} embed`;
  }

  update(id: number, updateEmbedDto: UpdateEmbedDto) {
    return `This action updates a #${id} embed`;
  }

  remove(id: number) {
    return `This action removes a #${id} embed`;
  }
}
