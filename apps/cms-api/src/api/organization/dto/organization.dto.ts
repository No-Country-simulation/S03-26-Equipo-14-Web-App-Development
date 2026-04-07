import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class proofOwnership {
    @IsString()
    @IsNotEmpty()
    ownerId!: string
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