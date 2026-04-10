import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [ApiModule, PublicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
