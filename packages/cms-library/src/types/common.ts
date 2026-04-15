export interface ComponentProps {
  apiKey: string;
  length?: number;
  className?: string;
  type?: TestimonialType;
}

export type TestimonialType = 'quote' | 'case' | 'video';

export interface Testimonial {
  id: string;
  type: TestimonialType;
  title: string;
  content: string;
  author: string;
  author_photo: string;
  author_role: string;
  media_url: string;
  media_description: string;
  rating: string;
}