import { Injectable } from '@nestjs/common';
import { Organization_Member } from '@workspace/database';
import { PrismaService } from '../prisma/prisma.service';

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

    async delete(id: string) {
        return await this.prisma.client.$transaction(async (tx) => {
            const user = await tx.organization_Member.delete({ where: { id } });
            await tx.user.delete({where: {id : user.user_id}})
        })
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
