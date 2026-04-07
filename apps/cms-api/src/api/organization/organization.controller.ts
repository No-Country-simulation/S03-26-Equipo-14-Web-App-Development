import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { createOrganizationDto, proofOwnership, UpdateOrganizationDto } from './dto/organization.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';

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

    @Patch()
    async update(@Body() data: UpdateOrganizationDto, @GetUser() user: JwtPayload) {
        return await this.organizationServices.update(data, user);
    }
}
