export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  ingredients: string[];
  steps: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeListResponse {
  recipes: Recipe[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}