"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { loadLastOrder } from "@/lib/lastOrder";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import { Order } from "@/types/order";
import LinkButton from "@/components/ui/LinkButton";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const customer = useAppSelector((state) => state.auth.customer);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const saved = loadLastOrder();
    if (!saved) {
      // Someone opened this page directly, with no order to show.
      router.replace("/products");
      return;
    }
    setOrder(saved);
  }, [router]);

  if (!order) return null;

  const whatsappUrl = buildOrderWhatsAppUrl(order);
  const firstName = order.customerName.split(" ")[0];

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-10 md:py-14">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-cream">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </div>
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
            <Link href="/track-order" className="font-semibold text-accent">
              Track order
            </Link>
            .
          </p>
        )}
        <LinkButton href="/products" variant="secondary">
          Continue shopping
        </LinkButton>
      </div>
    </div>
  );
}