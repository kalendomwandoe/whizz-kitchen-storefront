"use client";

import { useRouter } from "next/navigation";
import AccountOrdersList from "@/components/account/AccountOrdersList";

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="font-sans font-black text-2xl text-primary-dark mb-6">Your Orders</h1>
      <AccountOrdersList onSelect={(id) => router.push(`/account/orders/${id}`)} />
    </div>
  );
}