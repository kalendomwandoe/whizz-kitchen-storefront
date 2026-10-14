import { baseApi } from "./baseApi";
import { Recipe, RecipeListResponse } from "@/types/recipe";

interface RecipeListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const recipeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query<RecipeListResponse, RecipeListParams | void>({
      query: (params) => ({ url: "/recipes", params: params ?? undefined }),
      transformResponse: (response: { data: RecipeListResponse }) => response.data,
      providesTags: ["Recipe"],
    }),
    getRecipe: builder.query<Recipe, string>({
      query: (idOrSlug) => `/recipes/${idOrSlug}`,
      transformResponse: (response: { data: Recipe }) => response.data,
      providesTags: ["Recipe"],
    }),
  }),
});

export const { useGetRecipesQuery, useGetRecipeQuery } = recipeApi;