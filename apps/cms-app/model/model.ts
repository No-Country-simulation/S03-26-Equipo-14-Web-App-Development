export const categories = ['product', 'event', 'client', 'industry'] as const;

export const testimonialType = ['quote', 'case', 'video'] as const;

export const testimonialStatus = [
  'draft',
  'pending',
  'review',
  'published',
  'rejected',
] as const;

export type Category = (typeof categories)[number];
export type TestimonialType = (typeof testimonialType)[number];
export type TestimonialStatus = (typeof testimonialStatus)[number];
