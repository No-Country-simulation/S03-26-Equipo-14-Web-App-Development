import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createOrganizationInput, searchOrganizationInput, updateOrganizationInput } from "./interfaces/organization.interface";

@Injectable()
export class OrganizationRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(orgData: createOrganizationInput) {
        return await this.prisma.client.organization.create({
            data: { ...orgData },
        })
    };
    async findAll(type?: string, vars?: searchOrganizationInput) {
        switch (type) {
            case "name":
                return await this.prisma.client.organization.findMany({ where: { name: vars?.name } });
            case "description":
                return await this.prisma.client.organization.findMany({ where: { description: vars?.description } });
            case "user_id":
                return await this.prisma.client.organization.findMany({ where: { user_id: vars?.user_id } });
            default:
                return await this.prisma.client.organization.findMany();
        }
    }

    async findOne(char: { name?: string, description?: string, user_id?: string }) {
        return await this.prisma.client.organization.findFirst({
            where: char
        })
    };

    async findById(id: string) {
        try {
            const org = await this.prisma.client.organization.findUnique({ where: { id } });

            if (org == null) throw new NotFoundException("The Organization isn't in our DB. Try with another id. Have a great day!");
            return org;
        } catch (error: any | Error) {
            throw new ConflictException(error);
        }
    }

    async update(id: string, data: updateOrganizationInput) {
        return await this.prisma.client.organization.update({
            where: { id },
            data
        })
    }

    async memberList(id: string) {
        return await this.prisma.client.organization.findUnique({
            where: { id },
            include: {
                organizationMembers: true,
            }
        })
    }

    async delete(id: string) {
        await this.prisma.client.organization.update({
            where: { id }, data: {
                organizationMembers: {
                    deleteMany: {}
                },
                projects: {
                    deleteMany: {}
                }
            }
        })
        return await this.prisma.client.organization.delete({ where: { id } });
    }
} 
