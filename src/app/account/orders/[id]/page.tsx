"use client";

import { useParams, useRouter } from "next/navigation";
import AccountOrderDetail from "@/components/account/AccountOrderDetail";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return <AccountOrderDetail orderId={id} onBack={() => router.push("/account/orders")} />;
}