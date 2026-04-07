import { IsString, IsUUID } from "class-validator";

export class deleteTestimonialDTO {
    @IsString()
    @IsUUID()
    userId!: string
}
