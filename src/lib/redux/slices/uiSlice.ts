import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  mobileMenuOpen: boolean;
  accountModalOpen: boolean;
}

const initialState: UiState = {
  mobileMenuOpen: false,
  accountModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    openAccountModal: (state) => {
      state.accountModalOpen = true;
    },
    closeAccountModal: (state) => {
      state.accountModalOpen = false;
    },
  },
});

export const { toggleMobileMenu, closeMobileMenu, openAccountModal, closeAccountModal } =
  uiSlice.actions;
export default uiSlice.reducer;