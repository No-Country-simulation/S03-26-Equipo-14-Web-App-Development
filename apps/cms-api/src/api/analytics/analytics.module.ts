import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsRepository, ProjectRepository, TestimonialRepository } from '@repo/api';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository, ProjectRepository, TestimonialRepository],
})
export class AnalyticsModule {}
