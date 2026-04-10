import { Category, TestimonialType, TestimonialStatus } from '../model/model';

export interface Testimonial {
  id: string;
  category: Category;
  tags: { id: string; name: string }[];
  memberId: string;
  proyectId: string;
  type: TestimonialType;
  name: string;
  content: string;
  author: string;
  author_photo: string;
  authorRole: string;
  media_url: string;
  media_description: string;
  status: TestimonialStatus;
  rating: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  rejectReason: string;
}

export interface Project {
  id: string;
  value: string;
  name: string;
  testimonials?: Testimonial[];
}
