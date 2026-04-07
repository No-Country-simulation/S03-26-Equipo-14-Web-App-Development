import { Module } from '@nestjs/common';
import { EmbedModule } from './embed/embed.module';

@Module({
  imports: [EmbedModule],
})
export class PublicModule {}
