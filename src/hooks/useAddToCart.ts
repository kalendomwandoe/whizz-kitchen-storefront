"use client";

import { useEffect, useRef, useState } from "react";
import { useAddCartItemMutation } from "@/lib/redux/api/cartApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { showToast } from "@/lib/redux/slices/toastSlice";
import { openCart } from "@/lib/redux/slices/cartSlice";
import { getErrorMessage } from "@/lib/errors";

/** Everything that uses this key shares ONE "add to cart" request state (the header reads it too). */
export const ADD_TO_CART_KEY = "add-to-cart";

/** How long the button stays in its "Added" look. */
const ADDED_MS = 1200;

export function useAddToCart() {
  // The shared key lets the header see every add. "Busy" and "Added" are tracked here instead,
  // so each button (there is one per product card) only reacts to its own click.
  const [addCartItem] = useAddCartItemMutation({ fixedCacheKey: ADD_TO_CART_KEY });
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Stop the "Added" timer if the page goes away mid-way
  useEffect(() => () => clearTimeout(timer.current), []);

  const addToCart = async (variantId: string, quantity: number = 1) => {
    setIsLoading(true);
    try {
      await addCartItem({ variantId, quantity }).unwrap();

      // One event, calm feedback: the button says "Added", the header icon bumps, and a toast
      // offers "View cart". The cart drawer no longer jumps open and covers what you were doing.
      setJustAdded(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setJustAdded(false), ADDED_MS);

      dispatch(
        showToast({
          message: "Added to cart",
          type: "success",
          action: { label: "View cart", onClick: () => dispatch(openCart()) },
        }),
      );
    } catch (err) {
      const message = getErrorMessage(err, "Could not add to cart");
      dispatch(showToast({ message, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };

  return { addToCart, isLoading, justAdded };
}