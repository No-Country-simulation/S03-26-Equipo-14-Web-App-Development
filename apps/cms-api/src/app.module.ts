import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './api/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './api/auth/guards/jwt-auth.guard';
import {
  UserRepository,
  CategoryRepository,
  TestimonialRepository,
  PrismaModule,
  TagRepository,
  OrganizationMemberRepository,
  OrganizationRepository,
} from '@repo/api';
import { CategoryModule } from './api/category/category.module';
import { MailModule } from './api/mail/mail.module';
import { TestimonialsModule } from './api/testimonials/testimonials.module';
import { TagModule } from './api/tag/tag.module';
import { OrgRolesGuard } from './api/common/guards/organization-role.guard';
import { ProjectsModule } from './api/projects/projects.module';
import { AnalyticsModule } from './api/analytics/analytics.module';
import { OrganizationModule } from './api/organization/organization.module';
import { ApiModule } from './api/api.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [ApiModule, PublicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
