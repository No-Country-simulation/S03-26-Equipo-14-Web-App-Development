import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TagModule } from './tags/tag.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import {
  UserRepository,
  CategoryRepository,
  PrismaModule,
  PrismaService,
  TagRepository,
} from '@repo/api';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    AuthModule,
    TagModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    UserRepository,
    CategoryRepository,
    TagRepository,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
