export type TabValue = 'caso' | 'video';

export interface TestimonialFormValues {
  author: string;
  authorRole: string;
  title: string;
  content: string;
  videoSummary: string;
  categoryId: string;
  tagIds: string[];
  isDraft: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface TestimonialFormProps {
  mode?: 'create' | 'edit';
  defaultValues?: Partial<TestimonialFormValues>;
  testimonialId?: string;
  defaultTab?: TabValue;
  existingAuthorPhoto?: string;
  existingMediaUrl?: string;
}

export function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}
