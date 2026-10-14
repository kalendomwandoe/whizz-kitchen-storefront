import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
}

interface AuthState {
  customer: CustomerSummary | null;
  token: string | null;
}

const initialState: AuthState = {
  customer: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ customer: CustomerSummary; token: string }>,
    ) => {
      state.customer = action.payload.customer;
      state.token = action.payload.token;
    },
     // Used only during rehydration — sets the token before we've
    // actually fetched the customer's profile with it.
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.customer = null;
      state.token = null;
    },
  },
});

export const { setCredentials, setToken, logout } = authSlice.actions;
export default authSlice.reducer;