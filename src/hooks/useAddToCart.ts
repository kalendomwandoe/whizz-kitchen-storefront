"use client";

import { useAddCartItemMutation } from "@/lib/redux/api/cartApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { showToast } from "@/lib/redux/slices/toastSlice";
import { openCart } from "@/lib/redux/slices/cartSlice";
import { getErrorMessage } from "@/lib/errors";


export function useAddToCart() {
  const [addCartItem, { isLoading }] = useAddCartItemMutation();
  const dispatch = useAppDispatch();

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      await addCartItem({ variantId, quantity }).unwrap();
      dispatch(showToast({ message: "Added to cart", type: "success" }));
      dispatch(openCart());
    } catch (err) {
      const message = getErrorMessage(err, "Could not add to cart");
      dispatch(showToast({ message, type: "error" }));
    }
  };

  return { addToCart, isLoading };
}