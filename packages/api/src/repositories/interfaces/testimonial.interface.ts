import {
  TestimonialStatus,
  TestimonialType,
  Prisma,
} from '@workspace/database';

export interface CreateQuoteInput {
  project_id: string;
  //category?
  author: string;
  type: TestimonialType;
  author_photo?: string;
  author_role: string;
  content: string;
  rating: number;
  media_url?: string;
}

export interface CreateTestimonialInput {
  category_id: string;
  member_id: string;
  project_id: string;

  type: TestimonialType;
  title?: string;
  author: string;
  author_photo?: string;
  author_role?: string;
  content?: string;

  media_url: string;
  media_description: string;
  status: TestimonialStatus;
  slug?: string;
  tags?: string[];
}

export interface FindAllTestimonialsQuery {
  category_id?: string;
  type?: string;
  orderBy?: Prisma.TestimonialOrderByWithRelationInput;
}

export interface FindByFragment {
  fragment: string;
}

export interface ChangeStatusInput {
  id: string;
  type: TestimonialType;
  status: TestimonialStatus;
}
