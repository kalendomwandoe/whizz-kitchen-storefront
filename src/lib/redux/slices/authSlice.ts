import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
}

// idle     = the app has just loaded and has not looked for a saved login yet
// checking = a saved token exists and we are asking the server who it belongs to
// ready    = we know the answer: either a customer, or nobody is logged in
export type AuthStatus = "idle" | "checking" | "ready";

interface AuthState {
  customer: CustomerSummary | null;
  token: string | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  customer: null,
  token: null,
  status: "idle",
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
      state.status = "ready";
    },
    // Used only during rehydration — sets the token before we've
    // actually fetched the customer's profile with it.
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.status = "checking";
    },
    // There was no saved login, so we already know nobody is logged in.
    authResolved: (state) => {
      state.status = "ready";
    },
    logout: (state) => {
      state.customer = null;
      state.token = null;
      state.status = "ready";
    },
  },
});

export const { setCredentials, setToken, authResolved, logout } = authSlice.actions;
export default authSlice.reducer;