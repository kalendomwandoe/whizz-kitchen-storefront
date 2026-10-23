"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { CartItem } from "@/types/cart";
import { useAppDispatch } from "@/lib/redux/hooks";
import { showToast } from "@/lib/redux/slices/toastSlice";
import {
  cartApi,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
} from "@/lib/redux/api/cartApi";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { pickTransition, springs } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function CartItemRow({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();
  const reduced = usePrefersReducedMotion();
  const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartItemQuantityMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

  const { variant } = item;
  const image = variant.images[0];
  const href = `/products/${variant.product.slug}`;
  const busy = isUpdating || isRemoving;
  const atMax = item.quantity >= variant.stock;
  const unavailable = !variant.isActive || variant.isComingSoon || !variant.product.isActive;
  const lineTotal = Number(variant.price) * item.quantity;

  const changeQuantity = async (quantity: number) => {
    try {
      await updateQuantity({ itemId: item.id, data: { quantity } }).unwrap();
    } catch (err) {
      dispatch(
        showToast({ message: getErrorMessage(err, "Could not update quantity"), type: "error" }),
      );
    }
  };

  // Undo: add the same variant back, with the same quantity. It is sent through the store
  // directly (not through this row's hook), because this row is already gone by then.
  const restore = async (variantId: string, quantity: number) => {
    try {
      await dispatch(cartApi.endpoints.addCartItem.initiate({ variantId, quantity })).unwrap();
    } catch (err) {
      dispatch(
        showToast({ message: getErrorMessage(err, "Could not restore the item"), type: "error" }),
      );
    }
  };

  const remove = async () => {
    const { variantId, quantity } = item; // remember them for Undo
    try {
      await removeItem(item.id).unwrap();
      dispatch(
        showToast({
          message: "Removed from cart",
          type: "success",
          duration: 5000,
          action: { label: "Undo", onClick: () => restore(variantId, quantity) },
        }),
      );
    } catch (err) {
      dispatch(showToast({ message: getErrorMessage(err, "Could not remove item"), type: "error" }));
    }
  };

  const stepper =
    "flex h-8 w-8 items-center justify-center font-sans text-primary-dark disabled:opacity-30";

  // A row folds away (height and opacity to zero) and the rows below slide up with it, so
  // nothing jumps (skill §7: leave the way it arrived). A new row unfolds the same way.
  // With Reduce Motion on, it only fades.
  const folded = reduced ? { opacity: 0 } : { height: 0, opacity: 0 };
  const open = reduced ? { opacity: 1 } : { height: "auto", opacity: 1 };

  return (
    <motion.div
      initial={folded}
      animate={open}
      exit={folded}
      transition={pickTransition(springs.default, reduced)}
      className="overflow-hidden"
    >
      <div
        className={`flex gap-3 py-4 transition-opacity duration-(--duration-quick) ${
          isRemoving ? "opacity-60" : ""
        }`}
      >
        <Link
          href={href}
          aria-hidden="true"
          tabIndex={-1}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream"
        >
          {image && (
            <Image
              src={image.url}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex justify-between gap-2">
            <Link
              href={href}
              className="font-sans text-sm font-bold text-primary-dark line-clamp-1 hover:underline"
            >
              {variant.product.name}
            </Link>
            <p className="shrink-0 font-sans text-sm font-semibold text-primary-dark">
              {formatPrice(lineTotal)}
            </p>
          </div>

          <p className="font-sans text-xs text-primary-dark/60">
            {variant.size}
            {variant.color ? ` – ${variant.color}` : ""} · {formatPrice(variant.price)} each
          </p>

          {unavailable && (
            <p className="mt-1 font-sans text-xs font-semibold text-red-600">
              No longer available. Remove it to check out.
            </p>
          )}

          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-primary/20">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={busy || item.quantity <= 1}
                onClick={() => changeQuantity(item.quantity - 1)}
                className={stepper}
              >
                −
              </button>
              <span className="w-8 text-center font-sans text-sm" aria-live="polite">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={busy || atMax || unavailable}
                onClick={() => changeQuantity(item.quantity + 1)}
                className={stepper}
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="ml-auto font-sans text-xs text-red-600 hover:underline disabled:opacity-50"
            >
              Remove
            </button>
          </div>

          {atMax && !unavailable && (
            <p className="mt-1 font-sans text-xs text-muted">
              That&apos;s all we have in stock.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}