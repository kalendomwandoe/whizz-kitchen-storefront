import { OrderStatus } from "@/types/order";

const STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`px-3 py-1 rounded-full font-sans text-xs font-semibold capitalize ${STYLES[status]}`}>
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}