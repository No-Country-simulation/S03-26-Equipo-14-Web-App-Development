import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';



@Injectable()
export class ProjectMemberRespository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string) {
        return await this.prisma.client.project_Member.findUnique({ where: { id }, include: { project: true, organization_member: true } });
    }
    async addMember2Project(projectId: string, projectMemberId: string) {
        return await this.prisma.client.project_Member.update({
            where: {
                id: projectMemberId,
            },
            data: {
                project_id: projectId,
            }
        })
    }

    async create(organizationMemberId: string, projectId: string, userId: string){
        return await this.prisma.client.project_Member.create({
            data:{
                organization_member_id: organizationMemberId,
                project_id: projectId,
                user_id: userId,
            }
        })
    }

}
