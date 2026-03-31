import { Prisma, TestimonialType } from '@workspace/database';

export interface CreateOwnerInput {
  name: string;
  email: string;
  hashPassword: string;
  organizationName: string;
  organizationDescription: string;
}

export interface CreateMemberInput {
  name: string;
  email: string;
  generatePassword: string;
  role: string;
  organizationId: string;
  projectId: string;
}

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  categoryId: string;
}
export interface CreateTagInput {
  name: string;
  projectId?: string;
}
export interface FindAllTestimonialsQuery {
  category_id?: string;
  type?: string;
  orderBy?: Prisma.TestimonialOrderByWithRelationInput;
}
