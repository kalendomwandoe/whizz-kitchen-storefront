import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const guestToken =
      typeof window !== "undefined" ? localStorage.getItem("guestToken") : null;
    if (guestToken) {
      headers.set("X-Guest-Token", guestToken);
    }

    return headers;
  },
});

// Wraps the raw query so every single request, regardless of endpoint,
// checks whether the backend just issued a new guest token and saves it.
const baseQueryWithGuestToken: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const newGuestToken = result.meta?.response?.headers.get("x-guest-token");
  if (newGuestToken && typeof window !== "undefined") {
    localStorage.setItem("guestToken", newGuestToken);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithGuestToken,
  tagTypes: ["Product", "Category", "Recipe", "Cart", "Order", "Review", "Customer"],
  endpoints: () => ({}),
});