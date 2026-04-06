import { Injectable } from '@nestjs/common';
import { OrganizationRepository, UserRepository } from '@repo/api';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { createOrganizationDto } from './dto/organization.dto';
@Injectable()
export class OrganizationService {
    constructor(private readonly orgApi: OrganizationRepository,
        private readonly userApi: UserRepository
    ) { }

    async create(orgData: createOrganizationDto) {
        try {
            const answer = await this.orgApi.create(orgData);

            if (!answer) throw new ConflictException("Something went wrong creating the organization. Try again later please.");

            return `The Organization ${answer.name} was successfully created!`;

        } catch (error) {
            throw new ConflictException(error);
        }
    }
    async byId(orgId: string, ownerId: string) {
        try {
            const isThisOwner = await this.userApi.findById(ownerId, true);

            if (isThisOwner?.organizationMembers[0]?.role != "Owner") throw new ConflictException("The user must be an Owner to use this.");

            const org = await this.orgApi.findById(orgId);

            if (org == null) throw new NotFoundException("The Organization isn't in our DB. Try with another id. Have a great day!");
            return org;
        } catch (error) {
            throw new ConflictException(error)
        }

    }
}
