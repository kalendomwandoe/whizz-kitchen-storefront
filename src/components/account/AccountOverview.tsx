"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useLogout } from "@/hooks/useLogout";
import Button from "@/components/ui/Button";

export default function AccountOverview() {
  const customer = useAppSelector((state) => state.auth.customer);
  const logout = useLogout();

  if (!customer) return null;

  return (
    <div>
      <h2 className="font-sans font-black text-xl text-primary-dark mb-1">Hi, {customer.name}</h2>
      <p className="font-sans text-sm text-primary-dark/60 mb-6">{customer.email}</p>

      <Button variant="secondary" onClick={logout}>
        Log Out
      </Button>
    </div>
  );
}