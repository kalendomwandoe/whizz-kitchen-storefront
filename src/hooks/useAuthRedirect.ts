"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { loginHref } from "@/lib/redirect";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const customer = useAppSelector((state) => state.auth.customer);
  const isReady = useAppSelector((state) => state.auth.status === "ready");

  useEffect(() => {
    // "No customer" only means "not logged in" once we have finished checking.
    // While we are still checking, a saved login may be on its way.
    if (isReady && !customer) router.replace(loginHref(pathname));
  }, [isReady, customer, pathname, router]);

  return { customer, isReady };
}