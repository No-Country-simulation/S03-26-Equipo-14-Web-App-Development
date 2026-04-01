import { Injectable } from "@nestjs/common";
import { CreateProjectInput } from "./interfaces/project.interface";
import { PrismaService } from '../prisma/prisma.service';
import { Project } from "@workspace/database";

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

    async findOneById(id: string): Promise<Project | null>{
        return this.prisma.client.project.findUnique({
            where: {id}
        })
    }
}