
export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  categoryId: string;
}
