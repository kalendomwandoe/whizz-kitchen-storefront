import { OrderStatus } from "@/types/order";

// Every colour comes from the site's own palette. Each pair was checked for readable contrast
// (all above 4.5 : 1).
const STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-cream-dark text-primary-dark", // waiting: calm and neutral
  CONFIRMED: "bg-accent-text text-cream", // we have confirmed it: the brand orange
  OUT_FOR_DELIVERY: "bg-primary text-cream", // on its way: the strongest pill
  DELIVERED: "bg-success/10 text-success", // done: green
  CANCELLED: "bg-danger-bg text-danger", // stopped: red
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1 font-sans text-xs font-semibold capitalize ${STYLES[status]}`}
    >
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}