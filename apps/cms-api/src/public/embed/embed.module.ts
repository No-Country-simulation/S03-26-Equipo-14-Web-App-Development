import { Module } from '@nestjs/common';
import { EmbedService } from './embed.service';
import { EmbedController } from './embed.controller';

@Module({
  controllers: [EmbedController],
  providers: [EmbedService],
})
export class EmbedModule {}
