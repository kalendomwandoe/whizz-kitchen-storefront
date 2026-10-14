"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { loginHref } from "@/lib/redirect";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const customer = useAppSelector((state) => state.auth.customer);

  useEffect(() => {
    if (!customer) router.replace(loginHref(pathname));
  }, [customer, pathname, router]);

  return customer;
}