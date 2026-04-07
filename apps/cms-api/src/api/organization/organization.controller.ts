import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { createOrganizationDto, proofOwnership } from './dto/organization.dto';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationServices: OrganizationService) { }

    @Post()
    async create(@Body() data: createOrganizationDto) {
        return await this.organizationServices.create(data);
    }
    @Get("all")
    async findAll(@Query('type') type?: string, @Body() vars?: createOrganizationDto){
        return await this.organizationServices.findAll(type, vars);
    }
    @Get(':id')
    async getById(@Param('id') id: string, @Body() ownerDto: proofOwnership) {
        return this.organizationServices.byId(id, ownerDto.ownerId);
    }
}
