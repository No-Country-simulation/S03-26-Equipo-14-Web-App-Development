import { IsEmail } from "class-validator";

export class ResetPasswordDto{
    @IsEmail()
    email!: string
}