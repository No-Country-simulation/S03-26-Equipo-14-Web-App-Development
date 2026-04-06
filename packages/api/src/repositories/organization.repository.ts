import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createOrganizationInput } from "./interfaces/organization.interface";

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

    async create(orgData: createOrganizationInput) {
        return await this.prisma.client.organization.create({
            data: {...orgData},
        })
    };
    async findAll() {
        return await this.prisma.client.organization.findMany();
    }

    async findOne(char: {name?: string, description?: string, user_id?: string}) {
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
} 
