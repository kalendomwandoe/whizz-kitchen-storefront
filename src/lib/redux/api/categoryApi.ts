import { baseApi } from "./baseApi";
import { Category } from "@/types/category";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: (response: { data: Category[] }) => response.data,
      providesTags: ["Category"],
    }),
    getCategory: builder.query<Category, string>({
      query: (idOrSlug) => `/categories/${idOrSlug}`,
      transformResponse: (response: { data: Category }) => response.data,
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryQuery } = categoryApi;