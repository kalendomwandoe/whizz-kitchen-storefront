"use client";

import { useGetMyOrderQuery } from "@/lib/redux/api/orderApi";
import OrderDetails from "@/components/orders/OrderDetails";

interface AccountOrderDetailProps {
  orderId: string;
  onBack: () => void;
}

const backClass = "font-sans text-sm text-accent font-semibold";

export default function AccountOrderDetail({ orderId, onBack }: AccountOrderDetailProps) {
  const { data: order, isLoading, isError } = useGetMyOrderQuery(orderId);

  if (isLoading) return <p className="font-sans text-primary/60 py-4">Loading...</p>;

  if (isError || !order) {
    return (
      <div>
        <button onClick={onBack} className={backClass}>← All orders</button>
        <p className="font-sans text-red-600 mt-3">Order not found.</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className={backClass}>← All orders</button>
      <div className="mt-3">
        <OrderDetails order={order} />
      </div>
    </div>
  );
}