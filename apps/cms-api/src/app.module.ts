import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import {
  UserRepository,
  CategoryRepository,
  PrismaModule,
  TagRepository,
  PrismaService,
} from '@repo/api';
import { CategoryModule } from './category/category.module';
import { MailModule } from './mail/mail.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    CategoryModule,
    MailModule,
    TagModule,
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
