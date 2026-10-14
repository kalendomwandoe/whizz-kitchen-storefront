import { baseApi } from "./baseApi";
import { Product, ProductListResponse } from "@/types/product";

interface ProductListParams {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ProductListParams | void>({
      query: (params) => ({
        url: "/products",
        params: params ?? undefined,
      }),
      transformResponse: (response: { data: ProductListResponse }) => response.data,
      providesTags: ["Product"],
    }),
    getProduct: builder.query<Product, string>({
      query: (idOrSlug) => `/products/${idOrSlug}`,
      transformResponse: (response: { data: Product }) => response.data,
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productApi;