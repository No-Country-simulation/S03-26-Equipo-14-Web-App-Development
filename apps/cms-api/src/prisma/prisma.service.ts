import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma } from '@workspace/database';
import type { User } from '@workspace/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    public readonly client;

    constructor(){
        this.client = prisma;
    }

    onModuleInit() {
        console.log("Prisma Client ready (with Accelerate)");
    }

    async onModuleDestroy() {
        await this.client.$disconnect();        
    }
    
    
}
