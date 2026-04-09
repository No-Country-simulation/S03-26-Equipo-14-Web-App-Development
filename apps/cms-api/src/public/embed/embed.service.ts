import { Injectable } from '@nestjs/common';
import { CreateEmbedDto } from './dto/create-embed.dto';
import { UpdateEmbedDto } from './dto/update-embed.dto';

@Injectable()
export class EmbedService {

  findAll() {
    return `This action returns all embed`;
  }

}
