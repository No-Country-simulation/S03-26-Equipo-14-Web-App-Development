import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationMemberRepository, OrganizationRepository, ProjectMemberRespository, ProjectRepository, UserRepository } from '@repo/api';

@Module({
  providers: [OrganizationService, OrganizationRepository, UserRepository, OrganizationMemberRepository, ProjectMemberRespository, ProjectRepository],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
