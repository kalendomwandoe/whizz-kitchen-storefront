import type { Dispatch } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import { setCredentials } from "../slices/authSlice";
import {
  Customer,
  CustomerAuthResult,
  RegisterCustomerInput,
  LoginCustomerInput,
  UpdateCustomerProfileInput,
  ChangePasswordInput,
} from "@/types/customer";

// Runs inside the login/register request itself, so the mutation only
// resolves once credentials are saved AND the guest cart is merged.
const completeAuth = async (auth: CustomerAuthResult, dispatch: Dispatch) => {
  localStorage.setItem("customerToken", auth.token);
  // Dispatched first so the merge request below picks up the JWT.
  dispatch(setCredentials({ customer: auth.customer, token: auth.token }));

  const guestToken = localStorage.getItem("guestToken");
  if (!guestToken) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/merge`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ guestToken }),
    });
    // Only discard the guest token if the merge actually succeeded.
    if (res.ok) localStorage.removeItem("guestToken");
  } catch {
    // Best-effort: a failed merge shouldn't block login itself.
  }
};

export const customerAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerCustomer: builder.mutation<CustomerAuthResult, RegisterCustomerInput>({
      async queryFn(body, api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({ url: "/customers/auth/register", method: "POST", body });
        if (result.error) return { error: result.error };
        const auth = (result.data as { data: CustomerAuthResult }).data;
        await completeAuth(auth, api.dispatch);
        return { data: auth };
      },
      invalidatesTags: ["Cart"],
    }),
    loginCustomer: builder.mutation<CustomerAuthResult, LoginCustomerInput>({
      async queryFn(body, api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({ url: "/customers/auth/login", method: "POST", body });
        if (result.error) return { error: result.error };
        const auth = (result.data as { data: CustomerAuthResult }).data;
        await completeAuth(auth, api.dispatch);
        return { data: auth };
      },
      invalidatesTags: ["Cart"],
    }),
    getCustomerProfile: builder.query<Customer, void>({
      query: () => "/customers/auth/profile",
      transformResponse: (response: { data: Customer }) => response.data,
      providesTags: ["Customer"],
    }),
    updateCustomerProfile: builder.mutation<Customer, UpdateCustomerProfileInput>({
      query: (body) => ({ url: "/customers/auth/profile", method: "PUT", body }),
      transformResponse: (response: { data: Customer }) => response.data,
      invalidatesTags: ["Customer"],
    }),
    changeCustomerPassword: builder.mutation<void, ChangePasswordInput>({
      query: (body) => ({ url: "/customers/auth/change-password", method: "PUT", body }),
    }),
    resendVerificationEmail: builder.mutation<void, void>({
      query: () => ({ url: "/customers/auth/resend-verification", method: "POST" }),
    }),
    verifyEmail: builder.mutation<void, { token: string }>({
      query: (body) => ({ url: "/customers/auth/verify-email", method: "POST", body }),
      invalidatesTags: ["Customer"],
    }),
    requestPasswordReset: builder.mutation<void, { email: string }>({
      query: (body) => ({ url: "/customers/auth/request-password-reset", method: "POST", body }),
    }),
    resetPassword: builder.mutation<void, { token: string; newPassword: string }>({
      query: (body) => ({ url: "/customers/auth/reset-password", method: "POST", body }),
    }),
  }),
});

export const {
  useRegisterCustomerMutation,
  useLoginCustomerMutation,
  useGetCustomerProfileQuery,
  useLazyGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useChangeCustomerPasswordMutation,
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = customerAuthApi;