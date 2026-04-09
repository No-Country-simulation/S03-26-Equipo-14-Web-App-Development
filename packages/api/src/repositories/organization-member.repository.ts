import { Injectable } from '@nestjs/common';
import { Organization_Member } from '@workspace/database';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationRoleEnum } from 'src/types/organization.types';

@Injectable()
export class OrganizationMemberRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMembership({ user_id, organization_id }: { user_id: string; organization_id: string }): Promise<Organization_Member | null> {
        return this.prisma.client.organization_Member.findFirst({
            where: {
                user_id,
                organization_id
            }
        })
    }

    async changeRole({memberId, role} : {memberId: string, role: OrganizationRoleEnum}): Promise<Organization_Member> {
        return this.prisma.client.organization_Member.update({where: {id: memberId}, data: {role}})
    }
  
    async verifyMembership({id, organization_id}: {id: string, organization_id: string}): Promise<Organization_Member | null> {               
        return this.prisma.client.organization_Member.findFirst({
            where: {
                id,
                organization_id
            },
        })
    }
}
