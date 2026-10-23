"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAppSelector } from "@/lib/redux/hooks";
import { parseLastOrder, readLastOrderRaw } from "@/lib/lastOrder";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import { calmFade, springs } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import LinkButton from "@/components/ui/LinkButton";
import Skeleton from "@/components/ui/Skeleton";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const containerClass = "mx-auto max-w-2xl px-4 md:px-6 py-10 md:py-14";

// The saved order never changes while this page is open, so there is nothing to listen to.
const subscribe = () => () => {};
// On the server there is no sessionStorage. "undefined" means "not read yet", which is
// different from null ("read it: there is no order").
const readOnServer = (): string | null | undefined => undefined;

export default function OrderConfirmationPage() {
  const customer = useAppSelector((state) => state.auth.customer);
  const reduced = usePrefersReducedMotion();

  // Reads sessionStorage while the page is being drawn, so when you arrive from checkout the
  // order is on screen in the very first frame (no empty page, no extra render).
  const raw = useSyncExternalStore(subscribe, readLastOrderRaw, readOnServer);
  const order = useMemo(() => parseLastOrder(raw ?? null), [raw]);

  // Not read yet (the server's version of the page, and the instant before the browser takes over)
  if (raw === undefined) {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-full!" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="mt-8 h-40" />
      </div>
    );
  }

  // Opened directly, or in a new tab, with no order saved on this device
  if (!order) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold text-primary-dark">
          There is no recent order to show
        </h1>
        <p className="mx-auto mb-6 max-w-md font-sans text-primary-dark/70">
          If you have just ordered, we will message you on WhatsApp to confirm. You can also check
          an order at any time with its order number and your phone number.
        </p>
        <div className="flex flex-col items-center gap-3">
          <LinkButton href="/track-order">Track an order</LinkButton>
          <LinkButton href="/products" variant="secondary">
            Continue shopping
          </LinkButton>
        </div>
      </div>
    );
  }

  const whatsappUrl = buildOrderWhatsAppUrl(order);
  const firstName = order.customerName.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={calmFade}
      className={containerClass}
    >
      <div className="mb-8 text-center">
        {/* The check mark: the circle pops in, then the tick draws itself. With Reduce Motion on
            it is simply there, still. */}
        <motion.div
          initial={reduced ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springs.sheet}
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-cream"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <motion.path
              d="m5 12 5 5L20 7"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
        <h1 className="font-display font-bold text-3xl text-primary-dark">Thank you, {firstName}!</h1>
        <p className="font-sans text-primary-dark/70 mt-2">Your order has been received.</p>
        <div className="mt-4 inline-block rounded-xl bg-cream px-6 py-3">
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-primary-dark/60">
            Order number
          </p>
          <p className="font-display font-bold text-3xl text-primary-dark">#{order.orderNumber}</p>
        </div>
      </div>

      {whatsappUrl && (
        <div className="mb-6 rounded-xl border border-primary/10 bg-white p-4 text-center">
          <p className="font-sans text-sm text-primary-dark mb-3">
            We&apos;ll message you on WhatsApp to confirm. Want to reach us sooner?
          </p>
          <WhatsAppButton href={whatsappUrl} />
        </div>
      )}

      <div className="divide-y divide-primary/10 rounded-xl border border-primary/10 bg-white">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="font-sans text-sm font-bold text-primary-dark">{item.productName}</p>
              <p className="font-sans text-xs text-primary-dark/60">
                {item.variantSize} · Qty {item.quantity}
              </p>
            </div>
            <p className="shrink-0 font-sans text-sm font-semibold text-primary-dark">
              {formatPrice(item.subtotal)}
            </p>
          </div>
        ))}
        <div className="flex justify-between p-4 font-sans font-bold text-primary-dark">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-1 font-sans text-sm text-primary-dark/80">
        <p>
          <span className="font-semibold">Delivering to:</span> {order.deliveryAddress}
        </p>
        <p>
          <span className="font-semibold">Contact:</span> {order.customerName} · {order.customerPhone}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {customer ? (
          <LinkButton href={`/account/orders/${order.id}`} variant="secondary">
            View in my orders
          </LinkButton>
        ) : (
          <p className="text-center font-sans text-sm text-primary-dark/70">
            To check on this order later, keep your order number and phone number, then use{" "}
            <Link href="/track-order" className="font-semibold text-accent-text">
              Track order
            </Link>
            .
          </p>
        )}
        <LinkButton href="/products" variant="secondary">
          Continue shopping
        </LinkButton>
      </div>
    </motion.div>
  );
}