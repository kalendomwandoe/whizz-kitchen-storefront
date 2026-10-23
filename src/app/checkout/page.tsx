"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { openCart } from "@/lib/redux/slices/cartSlice";
import { useGetCartQuery } from "@/lib/redux/api/cartApi";
import { useCheckoutMutation } from "@/lib/redux/api/orderApi";
import { saveLastOrder } from "@/lib/lastOrder";
import { getErrorMessage } from "@/lib/errors";
import { CheckoutInput } from "@/types/order";
import type { CartItem } from "@/types/cart";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary, { getOrderTotal } from "@/components/checkout/OrderSummary";
import LinkButton from "@/components/ui/LinkButton";
import Skeleton from "@/components/ui/Skeleton";

const containerClass = "mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12";

// How long the page takes to fade out once the order is placed, before the confirmation opens
const FADE_OUT_MS = 200;

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.auth.customer);
  const authReady = useAppSelector((state) => state.auth.status === "ready");
  // Always fetch fresh: the cart may have changed since it was last cached
  // (for example, a guest cart just merged in during login).
  // Wait until we know who is checking out, so the cart and the form start from the right person.
  const { data: cart, isLoading: isCartLoading } = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !authReady,
  });
  const isLoading = isCartLoading || !authReady;
  const [checkout, { isLoading: isPlacing }] = useCheckoutMutation();
  const [placed, setPlaced] = useState(false);
  // Placing the order empties the cart. We keep a copy of what was ordered, so the page can stay
  // exactly as it is while it fades out, and never flashes "Your cart is empty".
  const [orderedItems, setOrderedItems] = useState<CartItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CheckoutInput) => {
    setError(null);
    try {
      const order = await checkout(data).unwrap();
      saveLastOrder(order);
      setOrderedItems(cart?.items ?? null);
      setPlaced(true);
      // Let the page fade out first; the confirmation then fades in
      await new Promise((resolve) => setTimeout(resolve, FADE_OUT_MS));
      router.push("/order-confirmation");
    } catch (err) {
      setError(getErrorMessage(err, "Could not place your order"));
    }
  };

  const items = orderedItems ?? cart?.items ?? [];
  const busy = isPlacing || placed;

  if (isLoading) {
    return (
      <div className={containerClass}>
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid md:grid-cols-[3fr_2fr] gap-8">
          <Skeleton className="h-96" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="font-display font-bold text-2xl text-primary-dark mb-2">
          Your cart is empty
        </h1>
        <p className="font-sans text-primary-dark/60 mb-6">
          Add something tasty and come back to check out.
        </p>
        <LinkButton href="/products">Browse the shop</LinkButton>
      </div>
    );
  }

  return (
    <div
      className={`${containerClass} transition-opacity duration-200 ease-(--ease-out) ${
        placed ? "opacity-0" : ""
      }`}
    >
      {/* Always in the page (empty until needed), so screen readers announce the change */}
      <p role="status" className="sr-only">
        {busy ? "Placing your order" : ""}
      </p>
      <h1 className="font-display font-bold text-3xl md:text-4xl text-primary-dark mb-1">
        Checkout
      </h1>
      {customer ? (
        <p className="mb-6 font-sans text-sm text-primary-dark/60">
          Checking out as {customer.name}
        </p>
      ) : (
        // One quiet line instead of a whole extra screen: guests go straight to the form.
        <p className="mb-2 flex items-center gap-1 font-sans text-sm text-primary-dark/70">
          Have an account?
          <Link
            href="/login?redirect=/checkout"
            className="inline-flex min-h-11 items-center rounded-md px-1 font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Log in
          </Link>
        </p>
      )}

      <div className="grid items-start gap-4 md:grid-cols-[3fr_2fr] md:gap-8">
        {/* The summary comes first in the page, so on a phone it sits above the form and
            Tab/screen readers meet it in the order you see it. From md up it moves to the
            right-hand column. */}
        <div inert={busy} className="md:sticky md:top-24 md:col-start-2 md:row-start-1">
          <OrderSummary items={items} onEditCart={() => dispatch(openCart())} />
        </div>
        <div className="md:col-start-1 md:row-start-1">
          <CheckoutForm
            initialName={customer?.name ?? ""}
            initialPhone={customer?.phone ?? ""}
            total={getOrderTotal(items)}
            isSubmitting={busy}
            error={error}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}