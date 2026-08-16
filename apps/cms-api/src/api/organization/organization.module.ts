import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationMemberRepository, OrganizationRepository, UserRepository } from '@repo/api';

@Module({
  providers: [OrganizationService, OrganizationRepository, UserRepository, OrganizationMemberRepository],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
