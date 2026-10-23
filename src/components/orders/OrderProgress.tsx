"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { OrderStatus } from "@/types/order";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Small line icons (24x24 grid, drawn with a 2px stroke), one per step
const ICONS: Record<string, ReactNode> = {
  PENDING: (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  CONFIRMED: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  OUT_FOR_DELIVERY: (
    <>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </>
  ),
  DELIVERED: (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
};

const CHECK = <path d="M20 6 9 17l-5-5" />;

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Received" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "OUT_FOR_DELIVERY", label: "On the way" },
  { status: "DELIVERED", label: "Delivered" },
];

function Icon({ children, strokeWidth = 2 }: { children: ReactNode; strokeWidth?: number }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function OrderProgress({ status }: { status: OrderStatus }) {
  const reduced = usePrefersReducedMotion();

  if (status === "CANCELLED") {
    return (
      <p className="rounded-lg bg-danger-bg px-4 py-3 font-sans text-sm text-danger">
        This order was cancelled.
      </p>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.status === status);

  return (
    <ol aria-label="Order progress" className="flex items-start">
      {STEPS.map((step, i) => {
        const reached = i <= currentIndex;
        // The step the order is at now. When it is delivered, every step is finished.
        const current = i === currentIndex && status !== "DELIVERED";
        const done = reached && !current;

        return (
          <li
            key={step.status}
            aria-current={current ? "step" : undefined}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {/* The line from the previous step's centre to this one's. Reached lines fill up from
                the left when the page opens (no animation with Reduce Motion). */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-4 right-1/2 h-0.5 w-full overflow-hidden bg-primary/15"
              >
                {reached && (
                  <motion.span
                    className="block h-full origin-left bg-primary"
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 * i, ease: "easeOut" }}
                  />
                )}
              </span>
            )}

            <span
              className={`relative z-10 flex size-8 items-center justify-center rounded-full ${
                done
                  ? "bg-primary text-cream"
                  : current
                    ? "bg-primary text-cream ring-4 ring-primary/15"
                    : "border border-primary/30 bg-cream text-primary/60"
              }`}
            >
              <Icon strokeWidth={done ? 3 : 2}>{done ? CHECK : ICONS[step.status]}</Icon>
            </span>

            <span
              className={`mt-2 font-sans text-xs ${
                reached ? "font-semibold text-primary-dark" : "text-primary-dark/60"
              }`}
            >
              <span className="sr-only">{done ? "Completed: " : current ? "" : "Upcoming: "}</span>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}