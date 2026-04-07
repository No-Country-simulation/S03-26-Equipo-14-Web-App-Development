import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule, UserRepository, CategoryRepository, TestimonialRepository, OrganizationMemberRepository, TagRepository } from '@repo/api';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { CategoryModule } from './category/category.module';
import { OrgRolesGuard } from './common/guards/organization-role.guard';
import { MailModule } from './mail/mail.module';
import { OrganizationModule } from './organization/organization.module';
import { ProjectsModule } from './projects/projects.module';
import { TagModule } from './tag/tag.module';
import { TestimonialsModule } from './testimonials/testimonials.module';

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
    AnalyticsModule,
    OrganizationModule,
    ApiModule,
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
export class ApiModule {}
