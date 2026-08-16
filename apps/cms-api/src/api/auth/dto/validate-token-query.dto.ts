import { IsEmail, IsString } from "class-validator";

export class ValidateTokenQueryDto {

    @IsEmail()
    email!: string
    
}
