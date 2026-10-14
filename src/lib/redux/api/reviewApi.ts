import { baseApi } from "./baseApi";
import { CreateReviewInput, Review, ReviewListResponse } from "@/types/review";

interface ProductReviewsParams {
  productId: string;
  page: number;
  limit: number;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<ReviewListResponse, ProductReviewsParams>({
      query: ({ productId, page, limit }) => ({
        url: `/reviews/product/${productId}`,
        params: { page, limit },
      }),
      transformResponse: (response: { data: ReviewListResponse }) => response.data,
      providesTags: (_result, _error, { productId }) => [{ type: "Review", id: productId }],
    }),
    createReview: builder.mutation<Review, CreateReviewInput>({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
      // The backend wraps the new review as { review, message }
      transformResponse: (response: { data: { review: Review } }) => response.data.review,
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Review", id: productId }],
    }),
  }),
});

export const { useGetProductReviewsQuery, useCreateReviewMutation } = reviewApi;