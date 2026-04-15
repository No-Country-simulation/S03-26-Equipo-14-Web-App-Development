import { ForbiddenException, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { ProjectMemberRespository, OrganizationMemberRepository, OrganizationRepository, OrganizationRoleEnum, UserRepository, ProjectRepository } from '@repo/api';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { createOrganizationDto, UpdateOrganizationDto, UpdateOrganizationMemberRoleDto } from './dto/organization.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { addMember2Project } from '../projects/dto/update-project.dto';
@Injectable()
export class OrganizationService {
    constructor(private readonly orgApi: OrganizationRepository,
        private readonly userApi: UserRepository,
        private readonly orgMemberApi: OrganizationMemberRepository,
        private readonly projectMemberApi: ProjectMemberRespository,
        private readonly projectApi: ProjectRepository,
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

    async addMember2Project(data: addMember2Project) {
        try {
            const orgMemberExists = await this.orgMemberApi.findById(data.orgMemberId);
            if (!orgMemberExists) throw new NotFoundException("Sorry, that Organization Member Credential doesn't exists on this DB.");

            const project = await this.projectApi.findOneById(data.projectId);
            if (!project || project == null) throw new NotFoundException("That Project doesn't exists.");

            if (orgMemberExists.organization_id != project.organization_id) throw new NotAcceptableException("The Project and the Organization must match to continue...");
            if (orgMemberExists.role == 'Owner') {
                const verifySameProject = orgMemberExists.projectMembers.map((member) => member.project_id == project.id);

                if (verifySameProject.length > 0) throw new NotAcceptableException("There is at least one Project Member on the list that is part of that Project already.");
            }

            const projectMember = orgMemberExists.projectMembers.find((member) => member.organization_member_id == orgMemberExists.id);

            if (!projectMember || projectMember == undefined) {
                const create = await this.projectMemberApi.create(orgMemberExists.id, data.projectId, orgMemberExists.user_id);

                return create;
            }

            const answer = await this.projectMemberApi.addMember2Project(project.id, projectMember.id);

            return answer;

        } catch (error) {
            throw new ConflictException(error);
        }
    }
    async update(data: UpdateOrganizationDto, user: JwtPayload) {
        const isOwner = await this.orgMemberApi.findMembership({ user_id: user.sub, organization_id: user.organizationId });
        if (!isOwner) throw new UnauthorizedException('You are not a member of this organization');
        if (isOwner.role != OrganizationRoleEnum.Owner) throw new UnauthorizedException('You are not the owner of this organization');

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

    async delete(id: string, userId: string) {
        try {
            const proofOwnership = await this.userApi.findById(userId, true);
            console.log(proofOwnership)
            if (proofOwnership?.organizationMembers[0]?.role != "Owner") throw new NotAcceptableException("Sorry, only an Owner can use this.");
            const existanceProof = await this.orgApi.findById(id);

            if (!existanceProof) throw new NotFoundException("The Organization you're trying to delete doesn't exists in first place.");

            const obliterate = await this.orgApi.delete(id);
            return `The Organization ${obliterate.name} has been deleted successfully!`
        } catch (error) {
            throw new ConflictException(error)
        }
    }

    async changeRoleMember(data: UpdateOrganizationMemberRoleDto, userId: string, user: JwtPayload) {
        if (user.sub == userId) throw new ConflictException("You can't change your own role");
        const requesterMembership = await this.orgMemberApi.findMembership({
            user_id: user.sub,
            organization_id: user.organizationId,
        });
        if (!requesterMembership || requesterMembership.role !== OrganizationRoleEnum.Owner) throw new ForbiddenException("Only owners can change roles");
        const membership = await this.orgMemberApi.findMembership({ user_id: userId, organization_id: user.organizationId });
        if (!membership) throw new ForbiddenException("User is not part of this organization");;
        if (data.role == membership.role) throw new ConflictException("The user already has this role");
        return await this.orgMemberApi.changeRole({ memberId: membership.id, role: data.role });
    }
    async deleteMember(memberId: string, user: JwtPayload) {
        const membership = await this.orgMemberApi.verifyMembership({ id: memberId, organization_id: user.organizationId });
        if (!membership) throw new NotFoundException('The member you are trying to delete doesn\'t exist or isn\'t in the organization');
        if (membership.user_id == user.sub) throw new UnauthorizedException('You can\'t delete yourself');
        return this.userApi.delete(membership.user_id);
    }
}
