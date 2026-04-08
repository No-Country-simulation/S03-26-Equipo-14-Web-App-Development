
export interface CreateCategoryInput {
  projectId?: string;
  name: string;
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  categoryId: string;
}
