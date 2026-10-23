"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closeCart } from "@/lib/redux/slices/cartSlice";
import { useGetCartQuery } from "@/lib/redux/api/cartApi";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { formatPrice } from "@/lib/format";
import CartItemRow from "@/components/cart/CartItemRow";
import LinkButton from "@/components/ui/LinkButton";
import Skeleton from "@/components/ui/Skeleton";

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isOpen = useAppSelector((state) => state.cartUi.isOpen);
  const authReady = useAppSelector((state) => state.auth.status === "ready");
  // Wait until we know who is shopping, so the cart is fetched with the right identity.
  const { data: cart, isLoading: isCartLoading } = useGetCartQuery(undefined, {
    skip: !authReady,
  });
  // While the request is skipped, "no data yet" must not look like "empty cart".
  const isLoading = isCartLoading || !authReady;

  const close = () => dispatch(closeCart());
  useEscapeKey(isOpen, close);

  // Any navigation (checkout, a product link, the Back button) closes the popup
  useEffect(() => {
    dispatch(closeCart());
  }, [pathname, dispatch]);

  if (!isOpen) return null;

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);

  return (
    <>
      {/* Invisible click-catcher: closes the popup on an outside click, with no dimming */}
      <div className="fixed inset-0 z-40" onClick={close} />

      <div
        role="dialog"
        aria-label="Your cart"
        className="fixed top-20 right-4 z-50 flex max-h-[75dvh] w-[92vw] max-w-sm flex-col rounded-xl border border-primary/10 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
          <h2 className="font-display font-bold text-lg text-primary-dark">
            Your cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </h2>
          <button onClick={close} aria-label="Close cart" className="text-primary-dark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {isLoading ? (
            <div className="flex flex-col gap-4 py-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : (
            <>
              {/* divide-y draws the line between rows. AnimatePresence keeps a removed row on
                  screen while it folds away, then lets it go. */}
              <div className="divide-y divide-primary/10">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </div>

              {items.length === 0 && (
                <div className="py-10 text-center">
                  <p className="mb-4 font-sans text-sm text-primary-dark/60">Your cart is empty.</p>
                  <LinkButton href="/products" variant="secondary">
                    Browse the shop
                  </LinkButton>
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-primary/10 px-4 py-3">
            <div className="mb-1 flex justify-between font-sans font-bold text-primary-dark">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-3 font-sans text-xs text-muted">
              Delivery fees are confirmed with you before you pay.
            </p>
                        <LinkButton href="/checkout" className="w-full">
              Checkout <span aria-hidden="true">·</span> {formatPrice(subtotal)}
            </LinkButton>
          </div>
        )}
      </div>
    </>
  );
}