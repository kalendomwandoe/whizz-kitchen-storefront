"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { CartItem } from "@/types/cart";
import { formatPrice } from "@/lib/format";

/** The order total. Exported so the page can show it on the Place order button too. */
export function getOrderTotal(items: CartItem[]): number {
  // Prices arrive as strings from the API, so convert before doing math
  return items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);
}

interface OrderSummaryProps {
  items: CartItem[];
  /** Shows an "Edit cart" button. The page decides what it does. */
  onEditCart?: () => void;
}

export default function OrderSummary({ items, onEditCart }: OrderSummaryProps) {
  const total = getOrderTotal(items);
  const bodyId = useId();
  // Only used on phones. From the md breakpoint up, the summary is always open.
  const [open, setOpen] = useState(false);

  const focusRing =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

  const editButton = onEditCart && (
    <button
      type="button"
      onClick={onEditCart}
      aria-haspopup="dialog"
      // min-h-11 is a finger-sized target; the negative margin keeps the text lined up with the edge
      className={`-mr-2 inline-flex min-h-11 items-center rounded-md px-2 font-sans text-sm font-semibold text-accent-text transition-[scale,opacity] duration-(--duration-quick) ease-(--ease-out) hover:underline active:scale-97 active:opacity-70 motion-reduce:active:scale-100 ${focusRing}`}
    >
      Edit cart
    </button>
  );

  return (
    <div className="rounded-xl bg-cream md:p-5">
      {/* Phones: the title is a button that opens and closes the summary. It already shows the total. */}
      <h2 className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((value) => !value)}
          className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-5 text-left font-display text-lg font-bold text-primary-dark transition-[scale] duration-(--duration-quick) ease-(--ease-out) active:scale-[0.99] motion-reduce:active:scale-100 ${focusRing}`}
        >
          <span>Order summary · {formatPrice(total)}</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`shrink-0 transition-transform duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h2>

      {/* Larger screens: a plain title, with Edit cart beside it */}
      <div className="mb-2 hidden items-center justify-between gap-3 md:flex">
        <h2 className="font-display font-bold text-xl text-primary-dark">Order summary</h2>
        {editButton}
      </div>

      {/* The body opens by animating its row height from 0 to its natural height (no measuring).
          Collapsed on a phone it is also invisible, so it cannot be tabbed into or read out. */}
      <div
        id={bodyId}
        className={`grid transition-[grid-template-rows] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none md:block ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div
          className={`overflow-hidden px-5 transition-[visibility] duration-(--duration-base) md:overflow-visible md:px-0 ${
            open ? "pb-5" : "max-md:invisible"
          } md:pb-0`}
        >
          <div className="mb-1 flex justify-end md:hidden">{editButton}</div>

          <div className="divide-y divide-primary/10">
            {items.map((item) => {
              const image = item.variant.images[0];
              return (
                <div key={item.id} className="flex gap-3 py-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                    {image && (
                      <Image
                        src={image.url}
                        alt={item.variant.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-bold text-primary-dark line-clamp-1">
                      {item.variant.product.name}
                    </p>
                    <p className="font-sans text-xs text-primary-dark/60">
                      {item.variant.size}
                      {item.variant.color ? ` – ${item.variant.color}` : ""} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-sans text-sm font-semibold text-primary-dark">
                    {formatPrice(Number(item.variant.price) * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between border-t border-primary/10 pt-3 font-sans font-bold text-primary-dark">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="mt-2 font-sans text-xs text-primary-dark/60">
            Delivery fees and payment are confirmed with you on WhatsApp after you order.
          </p>
        </div>
      </div>
    </div>
  );
}