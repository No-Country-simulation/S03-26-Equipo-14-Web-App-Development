import { Category, Project, Project_Member, Tag, Testimonial } from "@workspace/database";

export interface CreateProjectInput {
  name: string;
  description?: string;
  organization_id: string;
}

export interface UpdateProjectInput {
  id: string;
  name: string;
  description: string;
}

export interface projectInclude {
  projectMembers?: boolean;
  categories?: boolean;
  tags?: boolean;
  testimonials: boolean;
}

export type Project2 = Project & {
  projectMembers?: Project_Member[];
  categories?: Category[];
  tags?: Tag[]
  testimonials?: Testimonial[];
}