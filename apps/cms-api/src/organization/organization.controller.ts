import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { createOrganizationDto, proofOwnership } from './dto/organization.dto';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationServices: OrganizationService) { }

    @Post()
    async create(@Body() data: createOrganizationDto) {
        return await this.organizationServices.create(data);
    }
    @Get(":id")
    async getById(@Param('id') id: string, @Body() ownerStuff: proofOwnership) {
        return this.organizationServices.byId(id, ownerStuff.ownerId);
    }
}
