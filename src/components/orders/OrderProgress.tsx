import { OrderStatus } from "@/types/order";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Received" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "OUT_FOR_DELIVERY", label: "On the way" },
  { status: "DELIVERED", label: "Delivered" },
];

export default function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <p className="rounded-lg bg-red-50 text-red-700 font-sans text-sm px-4 py-3">
        This order was cancelled.
      </p>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.status === status);

  return (
    <ol className="flex items-start">
      {STEPS.map((step, i) => {
        const reached = i <= currentIndex;
        return (
          <li key={step.status} className="relative flex-1 flex flex-col items-center text-center">
            {/* Connector from the previous step's centre to this one's */}
            {i > 0 && (
              <span
                className={`absolute top-3 right-1/2 w-full h-0.5 ${
                  reached ? "bg-primary" : "bg-primary/15"
                }`}
              />
            )}
            <span
              className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                reached
                  ? "bg-primary text-cream"
                  : "bg-cream text-primary/40 border border-primary/20"
              }`}
            >
              {reached ? "✓" : i + 1}
            </span>
            <span
              className={`mt-1 font-sans text-[11px] sm:text-xs ${
                reached ? "text-primary-dark font-semibold" : "text-primary-dark/40"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}