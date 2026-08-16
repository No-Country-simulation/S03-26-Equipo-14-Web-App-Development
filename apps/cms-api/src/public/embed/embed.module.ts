import { Module } from '@nestjs/common';
import { EmbedService } from './embed.service';
import { EmbedController } from './embed.controller';
import { EmbedRepository } from '@repo/api';

@Module({
  controllers: [EmbedController],
  providers: [EmbedService, EmbedRepository],
})
export class EmbedModule {}
