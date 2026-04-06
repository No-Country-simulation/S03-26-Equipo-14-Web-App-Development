import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository, UserRepository } from '@repo/api';

@Module({
  providers: [OrganizationService, UserRepository, OrganizationRepository],
  controllers: [OrganizationController]
})
export class OrganizationModule {}
