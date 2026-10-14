"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken, setCredentials, logout } from "@/lib/redux/slices/authSlice";
import { useLazyGetCustomerProfileQuery } from "@/lib/redux/api/customerAuthApi";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [triggerGetProfile] = useLazyGetCustomerProfileQuery();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      setReady(true);
      return;
    }

    dispatch(setToken(token));

    triggerGetProfile()
      .unwrap()
      .then((customer) => {
        dispatch(setCredentials({ customer, token }));
      })
      .catch(() => {
        // Token is invalid/expired — clear everything rather than
        // leaving the app in a half-authenticated state.
        dispatch(logout());
      })
      .finally(() => setReady(true));
  }, [dispatch, triggerGetProfile]);

  // Briefly render nothing while we confirm the session, to avoid a
  // flash of "logged out" UI for someone who actually is logged in.
  if (!ready) return null;

  return <>{children}</>;
}