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