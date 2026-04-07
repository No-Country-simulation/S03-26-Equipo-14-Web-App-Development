import { IsNotEmpty, IsString } from "class-validator"

export class proofOwnership {
    @IsString()
    @IsNotEmpty()
    ownerId!: string
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