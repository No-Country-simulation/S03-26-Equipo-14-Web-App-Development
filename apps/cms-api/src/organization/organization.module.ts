import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository, UserRepository } from '@repo/api';

@Module({
<<<<<<< HEAD
  providers: [OrganizationService, UserRepository, OrganizationRepository],
  controllers: [OrganizationController]
=======
  providers: [OrganizationService, OrganizationRepository, UserRepository],
  controllers: [OrganizationController],
>>>>>>> 044e9e18ca6738b9b106ff7ec4c3927300e7ad6a
})
export class OrganizationModule {}
