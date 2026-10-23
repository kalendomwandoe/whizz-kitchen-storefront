"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetMyOrdersQuery } from "@/lib/redux/api/orderApi";
import { formatPrice } from "@/lib/format";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import Button from "@/components/ui/Button";

interface AccountOrdersListProps {
  onSelect: (orderId: string) => void;
  onNavigate?: () => void; // lets the modal close itself when a link inside it is clicked
}

export default function AccountOrdersList({ onSelect, onNavigate }: AccountOrdersListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetMyOrdersQuery({ page, limit: 10 });

  if (isLoading) return <p className="font-sans text-primary/60 py-4">Loading...</p>;
  if (isError || !data) {
    return <p className="font-sans text-red-600 py-4">Could not load your orders.</p>;
  }

  if (data.orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-sans text-primary-dark/60 mb-4">You haven&apos;t placed any orders yet.</p>
        <Link href="/products" onClick={onNavigate}>
          <Button>Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {data.orders.map((order) => (
          <button
            key={order.id}
            onClick={() => onSelect(order.id)}
            className="w-full text-left flex items-center justify-between gap-4 rounded-xl border border-primary/10 bg-white p-4 hover:shadow-md transition-shadow"
          >
            <div className="min-w-0">
              <p className="font-sans font-bold text-primary-dark">Order #{order.orderNumber}</p>
              <p className="font-sans text-xs text-primary-dark/60">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                · {order.items.length} item{order.items.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <OrderStatusBadge status={order.status} />
              <p className="font-sans font-semibold text-sm text-accent-text">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
                    <Button
            variant="secondary"
            aria-disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="font-sans text-sm text-primary-dark/60">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            aria-disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}