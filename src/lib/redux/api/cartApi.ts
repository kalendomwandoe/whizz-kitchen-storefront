import { baseApi } from "./baseApi";
import { Cart, AddCartItemInput, UpdateCartItemInput } from "@/types/cart";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => "/cart",
      transformResponse: (response: { data: Cart }) => response.data,
      providesTags: ["Cart"],
    }),
    addCartItem: builder.mutation<Cart, AddCartItemInput>({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      transformResponse: (response: { data: Cart }) => response.data,
      invalidatesTags: ["Cart"],
    }),
    updateCartItemQuantity: builder.mutation<Cart, { itemId: string; data: UpdateCartItemInput }>({
      query: ({ itemId, data }) => ({ url: `/cart/items/${itemId}`, method: "PUT", body: data }),
      transformResponse: (response: { data: Cart }) => response.data,
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<Cart, string>({
      query: (itemId) => ({ url: `/cart/items/${itemId}`, method: "DELETE" }),
      transformResponse: (response: { data: Cart }) => response.data,
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<Cart, void>({
      query: () => ({ url: "/cart", method: "DELETE" }),
      transformResponse: (response: { data: Cart }) => response.data,
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;