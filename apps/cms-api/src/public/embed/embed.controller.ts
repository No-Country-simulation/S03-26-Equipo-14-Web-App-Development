import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmbedService } from './embed.service';
import { CreateEmbedDto } from './dto/create-embed.dto';
import { UpdateEmbedDto } from './dto/update-embed.dto';
import { Public } from 'src/api/auth/decorators/public.decorator';

@Controller('embed')
export class EmbedController {
  constructor(private readonly embedService: EmbedService) {}



  @Get()
  @Public()
  findAll() {
    return this.embedService.findAll();
  }

  
}
