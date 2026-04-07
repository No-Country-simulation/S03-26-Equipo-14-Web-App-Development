import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { GetUser } from 'src/api/auth/decorators/get-user.decorator';
import { JwtPayload } from 'src/api/auth/types/jwt-payload.type';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }
  @Get('counterProject/:id')
  async countProjects(@Param('id') id: string) {
    return await this.analyticsService.counterProjects(id);
  }
  @Get('project/:projectId/rating')
  async getProjectCalification(@Param('projectId') projectId: string, @GetUser() user: JwtPayload) {
    return await this.analyticsService.getProjectCalification(projectId, user);
  }
}
