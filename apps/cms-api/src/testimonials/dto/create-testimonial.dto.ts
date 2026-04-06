import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TestimonialType, TestimonialStatus } from '@repo/api';
//testimonial quote visitor
export class CreateTestimonialQuoteDto {
  @IsString()
  projectId!: string;

  @IsEnum(TestimonialType)
  type!: TestimonialType; //default quote
  @IsString()
  author!: string;
  @IsString()
  @IsOptional()
  authorPhoto?: string;
  @IsString()
  authorRole!: string;
  @IsString()
  content!: string;
  @IsNumber()
  rating!: number;
  @IsString()
  @IsOptional()
  mediaUrl?: string;
  /* @IsEnum(TestimonialStatus)
  status!: string; // pending */
}
export class CreateTestimonialDto {
  @IsString()
  memberId!: string;
  @IsString()
  categoryId!: string;
  @IsString()
  projectId!: string;

  @IsEnum(TestimonialType)
  type!: TestimonialType; //default image
  @IsString()
  title!: string;
  @IsString()
  content!: string;
  @IsString()
  author!: string;
  @IsString()
  authorPhoto!: string;
  @IsString()
  authorRole!: string;
  @IsNumber()
  rating!: number;
  @IsString()
  mediaUrl!: string;
  @IsString()
  mediaDescription!: string;
  @IsEnum(TestimonialStatus)
  status!: TestimonialStatus; //draft or pending
  @IsString()
  slug!: string;
}
