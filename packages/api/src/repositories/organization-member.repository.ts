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
}
