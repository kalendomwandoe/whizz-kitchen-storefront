"use client";

import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { closeAccountModal } from "@/lib/redux/slices/uiSlice";
import { baseApi } from "@/lib/redux/api/baseApi";
import { clearLastOrder } from "@/lib/lastOrder";

export function useLogout() {
  const dispatch = useAppDispatch();

  return () => {
    clearLastOrder();
    dispatch(closeAccountModal());
    dispatch(logout());
    // Wipe cached API data so the next person on this device doesn't see this customer's cart.
    dispatch(baseApi.util.resetApiState());
  };
}