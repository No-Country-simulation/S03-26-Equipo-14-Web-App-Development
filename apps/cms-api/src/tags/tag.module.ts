import { Module } from '@nestjs/common';

import { PrismaModule } from '@repo/api';
//import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from '@nestjs/config';
import { TagRepository } from '../../../../packages/api/src/repositories/tag.repository';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../../.env',
    }),
  ],
  controllers: [TagController],
  providers: [TagService, TagRepository],
})
export class TagModule {}
