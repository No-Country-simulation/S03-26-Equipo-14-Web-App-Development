import { PartialType, PickType } from "@nestjs/swagger"
import { OrganizationRoleEnum } from "@repo/api"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class proofOwnership {
    @IsString()
    @IsNotEmpty()
    ownerId!: string
}
export class deleteDto{
    @IsString()
    @IsNotEmpty()
    userId!: string
}
export class createOrganizationDto{
    @IsString()
    @IsOptional()
    name!: string

    @IsString()
    @IsOptional()
    description!: string

    @IsString()
    @IsOptional()
    user_id!: string
}

export class UpdateOrganizationMemberRoleDto {
    @IsString()
    @IsEnum([OrganizationRoleEnum.Admin, OrganizationRoleEnum.Editor], {message: "The role must be admin or editor."})
    role! : OrganizationRoleEnum
}

export class UpdateOrganizationDto extends PartialType(PickType(createOrganizationDto, ['name', 'description'])) {}