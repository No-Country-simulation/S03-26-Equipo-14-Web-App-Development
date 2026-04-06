import { Body, Controller, Get, Param } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { proofOwnership } from './dto/organization.dto';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationServices: OrganizationService){}
    @Get(":id")
    async getById(@Param('id') id: string, @Body() ownerStuff: proofOwnership){
        return this.organizationServices.byId(id, ownerStuff.ownerId);
    }    
}
