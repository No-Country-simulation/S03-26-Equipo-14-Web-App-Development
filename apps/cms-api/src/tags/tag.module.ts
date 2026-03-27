import { Module } from '@nestjs/common';

import { TagRepository } from '../../../../packages/api/src/repositories/tag.repository';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository],
})
export class TagModule {}
