import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type: "success" | "error" }>) => {
      state.toasts.push({ id: Date.now(), ...action.payload });
    },
    dismissToast: (state, action: PayloadAction<number>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { showToast, dismissToast } = toastSlice.actions;
export default toastSlice.reducer;