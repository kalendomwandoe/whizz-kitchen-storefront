import { createSlice } from "@reduxjs/toolkit";

interface CartUiState {
  isOpen: boolean;
}

const initialState: CartUiState = { isOpen: false };

const cartSlice = createSlice({
  name: "cartUi",
  initialState,
  reducers: {
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
  },
});

export const { openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;