import { IsNotEmpty, IsString } from "class-validator"

export interface proofOwnership {
    ownerId: string
}

export class createOrganizationDto{
    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    description!: string

    @IsString()
    @IsNotEmpty()
    user_id!: string
}