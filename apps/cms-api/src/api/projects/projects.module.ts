import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { OrganizationMemberRepository, ProjectRepository, UserRepository } from '@repo/api';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, OrganizationMemberRepository, ProjectRepository, UserRepository],
})
export class ProjectsModule {}
