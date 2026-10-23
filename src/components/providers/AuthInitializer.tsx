"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken, setCredentials, authResolved, logout } from "@/lib/redux/slices/authSlice";
import { useLazyGetCustomerProfileQuery } from "@/lib/redux/api/customerAuthApi";

// Looks for a saved login when the app loads and reports the result to the store.
// It never hides the page: components read `auth.status` and decide for themselves.
export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [triggerGetProfile] = useLazyGetCustomerProfileQuery();

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      dispatch(authResolved());
      return;
    }

    dispatch(setToken(token));
    triggerGetProfile()
      .unwrap()
      .then((customer) => dispatch(setCredentials({ customer, token })))
      .catch(() => dispatch(logout()));
  }, [dispatch, triggerGetProfile]);

  return <>{children}</>;
}