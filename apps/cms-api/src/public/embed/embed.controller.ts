import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmbedService } from './embed.service';
import { CreateEmbedDto } from './dto/create-embed.dto';
import { UpdateEmbedDto } from './dto/update-embed.dto';

@Controller('embed')
export class EmbedController {
  constructor(private readonly embedService: EmbedService) {}

  @Post()
  create(@Body() createEmbedDto: CreateEmbedDto) {
    return this.embedService.create(createEmbedDto);
  }

  @Get()
  findAll() {
    return this.embedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.embedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmbedDto: UpdateEmbedDto) {
    return this.embedService.update(+id, updateEmbedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.embedService.remove(+id);
  }
}
