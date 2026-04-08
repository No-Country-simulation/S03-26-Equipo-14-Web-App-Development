import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OrganizationMemberRepository, OrganizationRepository, OrganizationRoleEnum, UserRepository } from '@repo/api';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { createOrganizationDto, UpdateOrganizationDto} from './dto/organization.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';
@Injectable()
export class OrganizationService {
    constructor(private readonly orgApi: OrganizationRepository,
        private readonly userApi: UserRepository,
        private readonly orgMemberApi: OrganizationMemberRepository
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
    async findAll(type?: string, vars?: createOrganizationDto) {
        try {
            const answer = await this.orgApi.findAll(type, vars);
            if (answer.length < 1) throw new NotFoundException("It looks like there aren't any Organization with your description... yet.");

            return answer;
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

    async update(data : UpdateOrganizationDto, user: JwtPayload){
        const isOwner = await this.orgMemberApi.findMembership({user_id: user.sub, organization_id: user.organizationId});
        if(!isOwner) throw new UnauthorizedException('You are not a member of this organization');
        if(isOwner.role != OrganizationRoleEnum.Owner) throw new UnauthorizedException('You are not the owner of this organization');

        return this.orgApi.update(user.organizationId, data);    
    }
    async orgMemberList(orgId: string) {
        try {
            const theList = await this.orgApi.memberList(orgId);

            if (theList == null || theList.organizationMembers.length < 1) throw new NotFoundException("There aren't any Organization Members on this Organization.");

            return theList;

        } catch (error) {
            throw new ConflictException(error);
        }
    }
}
