import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { createOrganizationDto, deleteDto, proofOwnership, UpdateOrganizationDto, UpdateOrganizationMemberRoleDto } from './dto/organization.dto';
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
    async findAll(@Query('type') type?: string, @Query('vars') vars?: createOrganizationDto) {
        return await this.organizationServices.findAll(type, vars);
    }
    @Get(':id')
    async getById(@Param('id') id: string, @Query() ownerDto: proofOwnership) {
        return this.organizationServices.byId(id, ownerDto.ownerId);
    }

    @Patch()
    async update(@Body() data: UpdateOrganizationDto, @GetUser() user: JwtPayload) {
        return await this.organizationServices.update(data, user);
    }
    @Get("membersList/:id")
    async membersList(@Param('id') id: string) {
        return this.organizationServices.orgMemberList(id);
    }
    @Delete("obliterate/:id")
    async delete(@Param('id') id: string, @Body() user: deleteDto) {
        return this.organizationServices.delete(id, user.userId);
    }

    @Patch("member/role/:userId")
    async changeRole(@Body() data: UpdateOrganizationMemberRoleDto, @Param("userId") userId: string, @GetUser() user: JwtPayload) {
        return this.organizationServices.changeRoleMember(data, userId, user)
    }
}
