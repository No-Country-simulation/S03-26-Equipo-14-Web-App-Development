import { Module } from '@nestjs/common';
import { EmbedModule } from './embed/embed.module';
import { EmbedRepository } from '@repo/api';

@Module({
  imports: [EmbedModule],
  providers: [EmbedRepository],
})
export class PublicModule {}
