import { baseApi } from "./baseApi";
import { CheckoutInput, Order, OrderListResponse, TrackOrderInput } from "@/types/order";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<Order, CheckoutInput>({
      query: (body) => ({ url: "/orders/checkout", method: "POST", body }),
      transformResponse: (response: { data: Order }) => response.data,
      invalidatesTags: ["Cart", "Order"],
    }),
    // A POST that only reads. Declared as a mutation so RTK Query doesn't
    // keep the result in its shared cache, which is better for private data.
    trackOrder: builder.mutation<Order, TrackOrderInput>({
      query: (body) => ({ url: "/orders/track", method: "POST", body }),
      transformResponse: (response: { data: Order }) => response.data,
    }),
    getMyOrders: builder.query<OrderListResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/orders/mine", params: params ?? undefined }),
      transformResponse: (response: { data: OrderListResponse }) => response.data,
      providesTags: ["Order"],
    }),
    getMyOrder: builder.query<Order, string>({
      query: (id) => `/orders/mine/${id}`,
      transformResponse: (response: { data: Order }) => response.data,
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useCheckoutMutation,
  useTrackOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderQuery,
} = orderApi;