import { Injectable } from "@nestjs/common";
import { CreateProjectInput } from "./interfaces/project.interface";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectRepository {
    constructor(
        private readonly prisma: PrismaService
    ){}
    async create({data}: {data: CreateProjectInput}){
        return this.prisma.client.project.create({
            data: {
                ...data
            }
        })
    }

    async findAll(organization_id: string){
        return this.prisma.client.project.findMany({
            where: {
                organization_id
            }
        })
    }
}