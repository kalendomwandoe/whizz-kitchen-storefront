"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetCartQuery } from "@/lib/redux/api/cartApi";
import { useCheckoutMutation } from "@/lib/redux/api/orderApi";
import { saveLastOrder } from "@/lib/lastOrder";
import { getErrorMessage } from "@/lib/errors";
import { CheckoutInput } from "@/types/order";
import CheckoutChoice from "@/components/checkout/CheckoutChoice";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import LinkButton from "@/components/ui/LinkButton";
import Skeleton from "@/components/ui/Skeleton";

const containerClass = "mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12";

export default function CheckoutPage() {
  const router = useRouter();
  const customer = useAppSelector((state) => state.auth.customer);
  // Always fetch fresh: the cart may have changed since it was last cached
  // (for example, a guest cart just merged in during login).
  const { data: cart, isLoading } = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [checkout, { isLoading: isPlacing }] = useCheckoutMutation();
  const [guestChosen, setGuestChosen] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CheckoutInput) => {
    setError(null);
    try {
      const order = await checkout(data).unwrap();
      saveLastOrder(order);
      // Success empties the cart, which would flash "Your cart is empty"
      // before navigation finishes. This flag prevents that.
      setPlaced(true);
      router.push("/order-confirmation");
    } catch (err) {
      setError(getErrorMessage(err, "Could not place your order"));
    }
  };

  if (placed) {
    return <p className="font-sans text-primary/60 text-center py-24">Placing your order...</p>;
  }

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

  if (!cart || cart.items.length === 0) {
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

  if (!customer && !guestChosen) {
    return (
      <div className="px-4 py-12 md:py-16">
        <CheckoutChoice onContinueAsGuest={() => setGuestChosen(true)} />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <h1 className="font-display font-bold text-3xl md:text-4xl text-primary-dark mb-1">
        Checkout
      </h1>
      <p className="font-sans text-sm text-primary-dark/60 mb-6">
        {customer ? `Checking out as ${customer.name}` : "Checking out as a guest"}
      </p>

      <div className="grid md:grid-cols-[3fr_2fr] gap-8 items-start">
        <CheckoutForm
          initialName={customer?.name ?? ""}
          initialPhone={customer?.phone ?? ""}
          isSubmitting={isPlacing}
          error={error}
          onSubmit={handleSubmit}
        />
        <div className="md:sticky md:top-24">
          <OrderSummary items={cart.items} />
        </div>
      </div>
    </div>
  );
}