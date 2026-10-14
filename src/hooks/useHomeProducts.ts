"use client";

import { useGetProductsQuery } from "@/lib/redux/api/productApi";

export function useHomeProducts() {
  const { data, isLoading, isError } = useGetProductsQuery({ limit: 12 });
  const products = data?.products ?? [];

  return {
    isLoading,
    isError,
    // At least one size you can actually buy
    available: products.filter((p) => p.variants.some((v) => !v.isComingSoon)).slice(0, 4),
    // Every size is still coming soon
    comingSoon: products
      .filter((p) => p.variants.length > 0 && p.variants.every((v) => v.isComingSoon))
      .slice(0, 4),
  };
}