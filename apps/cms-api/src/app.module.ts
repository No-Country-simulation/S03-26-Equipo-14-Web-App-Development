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
  TestimonialRepository,
  PrismaModule,
  TagRepository,
  OrganizationMemberRepository,
} from '@repo/api';
import { CategoryModule } from './category/category.module';
import { MailModule } from './mail/mail.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { TagModule } from './tag/tag.module';
import { OrgRolesGuard } from './common/guards/organization-role.guard';
import { ProjectsModule } from './projects/projects.module';

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
    TestimonialsModule,
    TagModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    UserRepository,
    CategoryRepository,
    TestimonialRepository,
    OrganizationMemberRepository,
    TagRepository,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: OrgRolesGuard },
  ],
})
export class AppModule {}
